#!/usr/bin/env node
/**
 * start.js - INTERCEPTOR One-Click Launcher
 *
 * Starts all four services with a single command:
 *   node start.js
 *
 * What it does:
 *  1. Checks node_modules for each Node.js service - installs if missing
 *  2. Installs Python requirements for the AI service if needed
 *  3. Starts all four services concurrently with colour-coded logs
 *  4. Kills everything cleanly on Ctrl+C
 */

const { spawn, execSync } = require("child_process");
const path  = require("path");
const fs    = require("fs");
const os    = require("os");

// ── Config ────────────────────────────────────────────────────────────────────

const ROOT    = __dirname;
const IS_WIN  = os.platform() === "win32";
const NPM     = IS_WIN ? "npm.cmd" : "npm";

// Detect available Python command
function detectPython() {
  for (const cmd of ["python3.14", "python3", "python"]) {
    try {
      const v = execSync(`${cmd} --version 2>&1`, { timeout: 3000 }).toString();
      if (v.includes("Python 3")) return cmd;
    } catch {}
  }
  return null;
}

// ANSI colours per service
const COLORS = {
  BACKEND:    "\x1b[34m",  // blue
  FRONTEND:   "\x1b[32m",  // green
  ADMIN:      "\x1b[35m",  // magenta
  AI_SERVICE: "\x1b[33m",  // yellow
  SYSTEM:     "\x1b[36m",  // cyan
  ERROR:      "\x1b[31m",  // red
  RESET:      "\x1b[0m",
  BOLD:       "\x1b[1m",
  DIM:        "\x1b[2m",
};

function colorLog(service, color, message) {
  const tag   = `[${service}]`.padEnd(14);
  const stamp = new Date().toTimeString().slice(0, 8);
  process.stdout.write(`${COLORS.DIM}${stamp}${COLORS.RESET} ${color}${COLORS.BOLD}${tag}${COLORS.RESET} ${message}\n`);
}

function sysLog(message)   { colorLog("SYSTEM",     COLORS.SYSTEM, message); }
function errLog(svc, msg)  { colorLog(svc,           COLORS.ERROR,  msg); }

// ── Banner ────────────────────────────────────────────────────────────────────

function printBanner() {
  console.clear();
  console.log(`
${COLORS.BOLD}${COLORS.SYSTEM}╔══════════════════════════════════════════════════════╗
║          INTERCEPTOR - One-Click Launcher            ║
║   Social Engineering Simulation & Awareness Platform ║
╚══════════════════════════════════════════════════════╝${COLORS.RESET}

  ${COLORS.FRONTEND}●${COLORS.RESET} Frontend     → ${COLORS.BOLD}http://localhost:3000${COLORS.RESET}
  ${COLORS.ADMIN}●${COLORS.RESET} Admin        → ${COLORS.BOLD}http://localhost:3001${COLORS.RESET}
  ${COLORS.BACKEND}●${COLORS.RESET} Backend API  → ${COLORS.BOLD}http://localhost:5000${COLORS.RESET}
  ${COLORS.AI_SERVICE}●${COLORS.RESET} AI Service   → ${COLORS.BOLD}http://localhost:8000${COLORS.RESET}

  Press ${COLORS.BOLD}Ctrl+C${COLORS.RESET} to stop all services.
${"─".repeat(56)}
`);
}

// ── Dependency helpers ────────────────────────────────────────────────────────

function checkNodeDeps(serviceDir, serviceName) {
  const nmPath = path.join(serviceDir, "node_modules");
  if (!fs.existsSync(nmPath)) {
    sysLog(`${serviceName} - node_modules missing, installing...`);
    return true; // needs install
  }
  // Also re-install if package.json is newer than node_modules
  try {
    const pkgStat = fs.statSync(path.join(serviceDir, "package.json"));
    const nmStat  = fs.statSync(nmPath);
    if (pkgStat.mtimeMs > nmStat.mtimeMs) {
      sysLog(`${serviceName} - package.json updated, reinstalling...`);
      return true;
    }
  } catch {}
  return false;
}

function installNodeDeps(serviceDir, serviceName) {
  return new Promise((resolve, reject) => {
    sysLog(`${serviceName} - running npm install...`);
    const proc = spawn(NPM, ["install"], {
      cwd:   serviceDir,
      stdio: ["ignore", "pipe", "pipe"],
      shell: IS_WIN,
    });
    proc.stdout.on("data", (d) => {
      const line = d.toString().trim();
      if (line) colorLog(serviceName, COLORS.SYSTEM, COLORS.DIM + line + COLORS.RESET);
    });
    proc.stderr.on("data", (d) => {
      const line = d.toString().trim();
      if (line && !line.startsWith("npm warn")) {
        colorLog(serviceName, COLORS.SYSTEM, COLORS.DIM + line + COLORS.RESET);
      }
    });
    proc.on("close", (code) => {
      if (code === 0) {
        sysLog(`${serviceName} - dependencies ready ✓`);
        resolve();
      } else {
        reject(new Error(`npm install failed for ${serviceName} (exit ${code})`));
      }
    });
  });
}

function installPythonDeps(serviceDir, pythonCmd) {
  return new Promise((resolve, reject) => {
    const reqFile = path.join(serviceDir, "requirements.txt");
    if (!fs.existsSync(reqFile)) { resolve(); return; }

    sysLog(`AI_SERVICE - checking Python requirements...`);
    const proc = spawn(pythonCmd, ["-m", "pip", "install", "-r", "requirements.txt", "-q", "--disable-pip-version-check"], {
      cwd:   serviceDir,
      stdio: ["ignore", "pipe", "pipe"],
      shell: IS_WIN,
    });
    proc.stdout.on("data", (d) => {
      const line = d.toString().trim();
      if (line) colorLog("AI_SERVICE", COLORS.AI_SERVICE, COLORS.DIM + line + COLORS.RESET);
    });
    proc.stderr.on("data", (d) => {
      const line = d.toString().trim();
      // pip sometimes writes notices to stderr - only log actual errors
      if (line && !line.toLowerCase().startsWith("notice") && !line.toLowerCase().startsWith("warning")) {
        colorLog("AI_SERVICE", COLORS.SYSTEM, COLORS.DIM + line + COLORS.RESET);
      }
    });
    proc.on("close", (code) => {
      if (code === 0) {
        sysLog("AI_SERVICE - Python requirements ready ✓");
        resolve();
      } else {
        reject(new Error(`pip install failed (exit ${code})`));
      }
    });
  });
}

// ── Service launcher ──────────────────────────────────────────────────────────

const processes = [];

function startService({ name, color, cwd, cmd, args, env }) {
  return new Promise((resolve) => {
    colorLog(name, color, `Starting...`);

    const proc = spawn(cmd, args, {
      cwd,
      env:   { ...process.env, ...env, FORCE_COLOR: "1" },
      stdio: ["ignore", "pipe", "pipe"],
      shell: IS_WIN,
    });

    processes.push({ name, proc });

    let started = false;

    const onLine = (data) => {
      data.toString().split(/\r?\n/).forEach((line) => {
        if (!line.trim()) return;
        colorLog(name, color, line);

        // Detect "ready" signals from each service type
        if (!started) {
          const lower = line.toLowerCase();
          if (
            lower.includes("ready") ||
            lower.includes("started") ||
            lower.includes("listening") ||
            lower.includes("running on") ||
            lower.includes("localhost") ||
            lower.includes("application startup complete")
          ) {
            started = true;
            colorLog(name, color, `${COLORS.BOLD}✓ Service is ready${COLORS.RESET}`);
            resolve(proc);
          }
        }
      });
    };

    proc.stdout.on("data", onLine);
    proc.stderr.on("data", onLine);

    proc.on("error", (err) => {
      errLog(name, `Failed to start: ${err.message}`);
      resolve(null);
    });

    proc.on("close", (code) => {
      if (code !== null && code !== 0) {
        errLog(name, `Exited with code ${code}`);
      }
    });

    // Resolve after 20 s even if we never saw a ready signal (some services are slow)
    setTimeout(() => {
      if (!started) {
        colorLog(name, color, "Still starting... (waiting for ready signal)");
        resolve(proc);
      }
    }, 20000);
  });
}

// ── Graceful shutdown ─────────────────────────────────────────────────────────

function shutdown() {
  console.log(`\n${COLORS.SYSTEM}${COLORS.BOLD}Stopping all services...${COLORS.RESET}`);
  for (const { name, proc } of processes) {
    try {
      colorLog(name, COLORS.SYSTEM, "Stopping...");
      if (IS_WIN) {
        // On Windows, kill the process tree
        execSync(`taskkill /PID ${proc.pid} /T /F 2>nul`, { stdio: "ignore" });
      } else {
        process.kill(-proc.pid, "SIGTERM");
      }
    } catch {}
  }
  console.log(`${COLORS.SYSTEM}${COLORS.BOLD}All services stopped. Goodbye!${COLORS.RESET}`);
  process.exit(0);
}

process.on("SIGINT",  shutdown);
process.on("SIGTERM", shutdown);
process.on("exit",    shutdown);

// ── Health-check poller ───────────────────────────────────────────────────────

function waitForHttp(url, maxSeconds = 60, intervalMs = 1500) {
  const http  = require("http");
  const https = require("https");
  const lib   = url.startsWith("https") ? https : http;

  return new Promise((resolve) => {
    let elapsed = 0;

    function attempt() {
      const req = lib.get(url, { timeout: 2000 }, (res) => {
        if (res.statusCode === 200) { resolve(true); return; }
        retry();
      });
      req.on("error", retry);
      req.on("timeout", () => { req.destroy(); retry(); });
    }

    function retry() {
      elapsed += intervalMs;
      if (elapsed >= maxSeconds * 1000) { resolve(false); return; }
      setTimeout(attempt, intervalMs);
    }

    attempt();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  printBanner();

  // ── 1. Detect Python ───────────────────────────────────────────────────────
  const PYTHON = detectPython();
  if (!PYTHON) {
    errLog("SYSTEM", "Python 3 not found. Install Python 3.x and make sure it is in PATH.");
    errLog("SYSTEM", "AI service will not start.");
  } else {
    sysLog(`Python detected: ${PYTHON}`);
  }

  // ── 2. Check & install Node.js dependencies ────────────────────────────────
  const nodeServices = [
    { name: "BACKEND",  dir: path.join(ROOT, "BACKEND") },
    { name: "FRONTEND", dir: path.join(ROOT, "frontend") },
    { name: "ADMIN",    dir: path.join(ROOT, "admin") },
  ];

  for (const { name, dir } of nodeServices) {
    if (!fs.existsSync(dir)) {
      errLog(name, `Directory not found: ${dir} - skipping`);
      continue;
    }
    if (checkNodeDeps(dir, name)) {
      try {
        await installNodeDeps(dir, name);
      } catch (err) {
        errLog(name, err.message);
      }
    } else {
      sysLog(`${name} - dependencies already installed ✓`);
    }
  }

  // ── 3. Install Python requirements ────────────────────────────────────────
  const aiDir = path.join(ROOT, "BACKEND", "ai_service");
  if (PYTHON && fs.existsSync(aiDir)) {
    try {
      await installPythonDeps(aiDir, PYTHON);
    } catch (err) {
      errLog("AI_SERVICE", err.message);
    }
  }

  sysLog("All dependencies ready - launching services...");
  console.log(`${"─".repeat(56)}`);

  const AI_PORT = 8000;

  // ── 4a. Start AI service first ────────────────────────────────────────────
  if (PYTHON && fs.existsSync(aiDir)) {
    await startService({
      name:  "AI_SERVICE",
      color: COLORS.AI_SERVICE,
      cwd:   aiDir,
      cmd:   PYTHON,
      args:  ["main.py"],
      env:   {},
    });

    // Poll the health endpoint until it responds (max 60 s)
    sysLog("Waiting for AI service to be healthy...");
    const aiReady = await waitForHttp(`http://localhost:${AI_PORT}/health`, 60, 1500);
    if (aiReady) {
      colorLog("AI_SERVICE", COLORS.AI_SERVICE, `${COLORS.BOLD}✓ Health check passed - http://localhost:${AI_PORT}${COLORS.RESET}`);
    } else {
      colorLog("AI_SERVICE", COLORS.ERROR, "Health check timed out after 60 s - backend will still start");
    }
    console.log(`${"─".repeat(56)}`);
  }

  // ── 4b. Start remaining services concurrently ─────────────────────────────
  sysLog("Starting Backend, Frontend and Admin...");
  await Promise.all([
    startService({
      name:  "BACKEND",
      color: COLORS.BACKEND,
      cwd:   path.join(ROOT, "BACKEND"),
      cmd:   NPM,
      args:  ["run", "dev"],
      env:   {},
    }),
    startService({
      name:  "FRONTEND",
      color: COLORS.FRONTEND,
      cwd:   path.join(ROOT, "frontend"),
      cmd:   NPM,
      args:  ["run", "dev"],
      env:   { PORT: "3000" },
    }),
    startService({
      name:  "ADMIN",
      color: COLORS.ADMIN,
      cwd:   path.join(ROOT, "admin"),
      cmd:   NPM,
      args:  ["run", "dev", "--", "--port", "3001"],
      env:   { PORT: "3001" },
    }),
  ]);

  console.log(`\n${"─".repeat(56)}`);
  sysLog(`${COLORS.BOLD}All services launched! Press Ctrl+C to stop.${COLORS.RESET}`);
  console.log(`${"─".repeat(56)}\n`);
}

main().catch((err) => {
  errLog("SYSTEM", `Fatal error: ${err.message}`);
  process.exit(1);
});
