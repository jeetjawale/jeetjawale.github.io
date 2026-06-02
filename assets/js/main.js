/* ════════════════════════════════════════════════════════════════
   JEET JAWALE — PORTFOLIO
   main.js — Boot sequence, Neural Canvas, CLI Terminal,
             Chatbot, Uptime, GitHub data, Contact form
   ════════════════════════════════════════════════════════════════ */

"use strict";

/* ──────────────────────────────────────────────────────────────── */
/*  BOOT SEQUENCE                                                    */
/* ──────────────────────────────────────────────────────────────── */

const BOOT_LINES = [
  {
    text: "[    0.000000] Linux version 7.0.9-204.fc44.x86_64 (gcc 14.1.1) (Fedora Linux)",
    cls: "",
  },
  {
    text: "[    0.000001] Command line: BOOT_IMAGE=/vmlinuz root=/dev/mapper/fedora-root ro",
    cls: "",
  },
  { text: "[    0.012834] BIOS-provided physical RAM map: 32768 MB", cls: "" },
  { text: "[    0.023415] ACPI: BIOS IRQ0 pin2 override", cls: "" },
  {
    text: "[    0.189234] PCI: Using configuration type 1 for base access",
    cls: "",
  },
  {
    text: "[    0.291847] systemd[1]: Starting jeet.jawale.portfolio.service...",
    cls: "boot-info",
  },
  {
    text: "[    0.399201] USB: keyboard detected — Cherry MX Blues. Nice.",
    cls: "",
  },
  { text: "[    0.445123] NVIDIA RTX: ready to cook", cls: "boot-ok" },
  {
    text: "[    0.512334] Loading neural network weights from checkpoint...",
    cls: "",
  },
  {
    text: "[    0.567890] checkpoint OK  (loss: 0.0012, acc: 99.8%)",
    cls: "boot-ok",
  },
  {
    text: "[    0.623456] Mounting /home/jeet/projects — 4,891 commits attached",
    cls: "",
  },
  {
    text: "[    0.734567] SSH agent: identity loaded — jeet_ed25519",
    cls: "boot-ok",
  },
  {
    text: "[    0.801234] Syncing node_01... [████████████] 100%",
    cls: "boot-ok",
  },
  {
    text: "[    0.867891] Syncing node_02... [████████████] 100%",
    cls: "boot-ok",
  },
  {
    text: "[    0.923456] Syncing node_03... [█████████░░░]  75% — almost there",
    cls: "boot-warn",
  },
  {
    text: "[    0.987654] Syncing node_03... [████████████] 100%",
    cls: "boot-ok",
  },
  {
    text: "[    1.034567] Distributed compute: all nodes synced",
    cls: "boot-ok",
  },
  {
    text: "[    1.145678] bash: work-life-balance: command not found",
    cls: "boot-err",
  },
  {
    text: "[    1.256789] Portfolio service: fully operational",
    cls: "boot-ok",
  },
  { text: "", cls: "" },
  {
    text: "[  OK  ] Reached target: jeet.jawale.portfolio — Welcome █",
    cls: "boot-ok",
  },
];

function startBootSequence() {
  const overlay = document.getElementById("boot-overlay");
  const log = document.getElementById("boot-log");
  if (!overlay || !log) return Promise.resolve();

  const urlParams = new URLSearchParams(window.location.search);
  const isSkipParam = urlParams.get("skipBoot") === "1";
  if (isSkipParam || sessionStorage.getItem("booted")) {
    overlay.style.display = "none";
    if (isSkipParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    document.body.classList.add("boot-skipped");
    sessionStorage.setItem("booted", "1");
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    let i = 0;
    let skipped = false;

    function skip() {
      if (skipped) return;
      skipped = true;
      document.body.classList.add("boot-skipped");
      sessionStorage.setItem("booted", "1");
      // Dump remaining lines instantly
      while (i < BOOT_LINES.length) {
        appendLine(BOOT_LINES[i]);
        i++;
      }
      setTimeout(() => {
        overlay.classList.add("boot-done");
        setTimeout(() => resolve(true), 900);
      }, 120);
    }

    document.addEventListener("keydown", skip, { once: true });
    overlay.addEventListener("click", skip, { once: true });

    function appendLine(line) {
      const el = document.createElement("div");
      el.className = "boot-line" + (line.cls ? " " + line.cls : "");
      el.textContent = line.text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }

    function showNext() {
      if (skipped) return;
      if (i >= BOOT_LINES.length) {
        setTimeout(() => {
          overlay.classList.add("boot-done");
          setTimeout(() => {
            sessionStorage.setItem("booted", "1");
            resolve(false);
          }, 900);
        }, 400);
        return;
      }
      appendLine(BOOT_LINES[i]);
      const delay =
        BOOT_LINES[i].text === ""
          ? 80
          : BOOT_LINES[i].cls === "boot-ok"
            ? Math.random() * 40 + 25
            : BOOT_LINES[i].cls === "boot-err"
              ? 180
              : Math.random() * 60 + 30;
      i++;
      setTimeout(showNext, delay);
    }

    showNext();
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  NEURAL NETWORK CANVAS                                           */
/* ──────────────────────────────────────────────────────────────── */

function initNeuralCanvas() {
  const canvas = document.getElementById("nn-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const CFG = {
    numNodes: window.innerWidth < 768 ? 32 : 80,
    connDist: 190,
    nodeRadius: { min: 1, max: 3.5 },
    speed: 0.28,
    activateEvery: 2000,
    hoverRadius: 110,
    // Gruvbox colors
    nodeColor: [250, 189, 47], // yellow-b
    edgeColor: [131, 165, 152], // blue-b
    pulseColor: [254, 128, 25], // orange-b
  };

  let W, H;
  const nodes = [];
  let mouseX = -9999,
    mouseY = -9999;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNodes() {
    nodes.length = 0;
    for (let i = 0; i < CFG.numNodes; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * CFG.speed,
        vy: (Math.random() - 0.5) * CFG.speed,
        r:
          CFG.nodeRadius.min +
          Math.random() * (CFG.nodeRadius.max - CFG.nodeRadius.min),
        act: 0,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      n.act = Math.max(0, n.act - 0.018);
    }

    // Mouse hover activation
    for (const n of nodes) {
      const dx = n.x - mouseX,
        dy = n.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.hoverRadius) {
        n.act = Math.max(n.act, 1 - dist / CFG.hoverRadius);
      }
    }

    // Draw edges
    const [er, eg, eb] = CFG.edgeColor;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = b.x - a.x,
          dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CFG.connDist) {
          const weight = 1 - dist / CFG.connDist;
          const actBoost = (a.act + b.act) * 0.3;
          const alpha = weight * 0.12 + actBoost;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${er},${eg},${eb},${Math.min(alpha, 0.65)})`;
          ctx.lineWidth = weight * 0.8 + actBoost;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    const [nr, ng, nb] = CFG.nodeColor;
    const [pr, pg, pb] = CFG.pulseColor;
    for (const n of nodes) {
      const baseAlpha = 0.25 + n.act * 0.7;
      const radius = n.r + n.act * 4;
      // Glow on activation
      if (n.act > 0.1) {
        const grad = ctx.createRadialGradient(
          n.x,
          n.y,
          0,
          n.x,
          n.y,
          radius * 4,
        );
        grad.addColorStop(0, `rgba(${pr},${pg},${pb},${n.act * 0.4})`);
        grad.addColorStop(1, `rgba(${pr},${pg},${pb},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${nr},${ng},${nb},${baseAlpha})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  // Periodic backprop-style activation pulse
  function triggerPulse() {
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    source.act = 1;
    // Spread to nearby nodes with delay
    for (const n of nodes) {
      const dx = n.x - source.x,
        dy = n.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CFG.connDist && n !== source) {
        setTimeout(
          () => {
            n.act = Math.max(n.act, 0.75 * (1 - dist / CFG.connDist));
          },
          50 + dist * 0.6,
        );
      }
    }
  }
  let pulseId = setInterval(triggerPulse, CFG.activateEvery);
  let animId;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
      clearInterval(pulseId);
    } else {
      draw();
      pulseId = setInterval(triggerPulse, CFG.activateEvery);
    }
  });

  // Mouse tracking (window-level, canvas is behind everything)
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true },
  );
  window.addEventListener("mouseleave", () => {
    mouseX = -9999;
    mouseY = -9999;
  });

  resize();
  makeNodes();
  draw();
  window.addEventListener(
    "resize",
    () => {
      resize();
      makeNodes();
    },
    { passive: true },
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  UPTIME COUNTER                                                   */
/* ──────────────────────────────────────────────────────────────── */

function initUptimeCounter() {
  const valEl = document.getElementById("uptime-val");
  const nfEl = document.getElementById("nf-uptime-display");
  if (!valEl && !nfEl) return;

  // Start from roughly when Fedora was first installed
  const start = new Date("2025-01-01T00:00:00");

  function fmt() {
    const diff = Math.floor((Date.now() - start.getTime()) / 1000);
    const d = Math.floor(diff / 86400);
    const h = Math.floor((diff % 86400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  function tick() {
    const str = fmt();
    if (valEl) valEl.textContent = str;
    if (nfEl) {
      nfEl.textContent = str;
    }
  }

  tick();
  let upId = setInterval(tick, 1000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(upId);
    else {
      tick();
      upId = setInterval(tick, 1000);
    }
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  COFFEE BAR ANIMATION                                            */
/* ──────────────────────────────────────────────────────────────── */

function initCoffeeBar() {
  const bar = document.getElementById("coffee-bar");
  const val = document.getElementById("coffee-val");

  // Calculate days since Jan 1 of current year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffDays = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) || 1;

  if (val) val.textContent = diffDays + " cups";

  if (!bar) return;

  // Animate after a short delay (post-boot feel)
  setTimeout(() => {
    // Max out at 100%, min 5% for visibility
    const pct = Math.min(100, Math.max(5, (diffDays / 365) * 100));
    bar.style.width = pct + "%";
  }, 400);
}

/* ──────────────────────────────────────────────────────────────── */
/*  CLI TERMINAL                                                    */
/* ──────────────────────────────────────────────────────────────── */

function initCliTerminal() {
  const output = document.getElementById("cli-output");
  const input = document.getElementById("cli-input");
  const body = document.getElementById("cli-body");
  if (!output || !input) return;

  const COMMANDS = {
    help: () => `Available commands:

  ls projects/          — list all projects
  cat resume.txt        — view resume summary
  sudo impress-recruiter — run recruitment protocol
  git log                  — view recent repo commits
  whoami                — current user
  uname -a              — system information
  ps aux                — running processes
  clear                 — clear terminal
  help                  — show this message

Tip: use ↑↓ arrow keys for command history.`,

    "ls projects/": () =>
      `total 4 (use 'cat <project>' for details)

drwxr-xr-x  job-pilot/                May 2026 → Present   [ACTIVE]
drwxr-xr-x  heritage-explorer/        Aug 2024 → Jun 2025  [DEPLOYED ✓]
drwxr-xr-x  course-exit-survey/       Feb 2024 → Jun 2024  [ARCHIVED]
drwxr-xr-x  c-learning-app/           Oct 2023 → Jan 2024  [ARCHIVED]
-rw-r--r--  more-in-progress.txt      ...`,

    "cat resume.txt": () =>
      `NAME:      Jeet Jawale
DEGREE:    B.Tech. Computer Engineering
LOCATION:  Navi Mumbai, India
FOCUS:     Software Engineering · AI · Full-Stack · Automation

SUMMARY:
  Built a geospatial radiation safety decision-support system at
  Bhabha Atomic Research Centre (BARC). Currently developing an
  AI-powered job application CRM using LangGraph and FastAPI.
  Seeking entry-level Software Engineering roles.

EXPERIENCE:
  BARC, Trombay (Jun–Aug 2025)
  Project Trainee — Radiation Safety Systems Division
  → Automated geospatial data processing workflows (Python/PyQGIS)
     — reduced manual preprocessing time by ~50%
  → Developed PyQt desktop interface for radiation safety
     decision-support system integrating QGIS spatial layers
  → Built geospatial visualization modules used in tabletop
     emergency response and countermeasure planning exercises

PROJECTS:
  JobPilot CRM           — Next.js / FastAPI / LangGraph / Supabase
  Heritage Explorer      — QGIS / React / MapLibre / Node.js / Firebase
  Course Exit Survey     — React / Firebase / Chart.js
  C-Learning App         — Flutter / Dart / Firebase

CERTIFICATIONS:
  → Google Cloud Career Launchpad Cloud Engineer
  → Linux Unhatched (Cisco Networking Academy)

STATUS:    ● Open to work
CONTACT:   mail@jeetjawale.dev`,

    "sudo impress-recruiter": () =>
      `[sudo] password for jeet: ••••••••
Authenticating... OK

     ██╗███████╗███████╗████████╗
     ██║██╔════╝██╔════╝╚══██╔══╝
     ██║█████╗  █████╗     ██║
██╗  ██║██╔══╝  ██╔══╝     ██║
╚██████║███████╗███████╗   ██║
 ╚═════╝╚══════╝╚══════╝   ╚═╝

impress-recruiter v2.6.1 — initializing...

[✓] Linux skills           VERIFIED
[✓] Coffee consumption     CRITICAL (847 cups)
[✓] Open source activity   PRESENT
[✓] Automation instinct    HIGH
[✓] Work-life balance      COMMAND NOT FOUND
[✓] Hire-ability score     99.8%  (loss: 0.0012)

Contact: mail@jeetjawale.dev
→ Offer drafted. Awaiting your signature. █`,

    "git log": async () => {
      try {
        const cachedLog = sessionStorage.getItem("github_git_log");
        if (cachedLog) return cachedLog;
        const res = await fetch(
          "https://api.github.com/repos/jeetjawale/jeetjawale.github.io/commits",
        );
        if (!res.ok) return "fatal: bad revision or path";
        const data = await res.json();
        const logStr = data
          .slice(0, 10)
          .map((c, i) => {
            const sha = c.sha.substring(0, 7);
            const msg = c.commit.message.split("\n")[0];
            const head = i === 0 ? " (HEAD -> main) " : " ";
            return `${sha}${head}${msg}`;
          })
          .join("\n");
        sessionStorage.setItem("github_git_log", logStr);
        return logStr;
      } catch (e) {
        return "fatal: your current branch appears to be broken";
      }
    },

    whoami: () => `jeet`,

    "uname -a": () =>
      `Linux jeet-pc 7.0.9-204.fc44.x86_64 #1 SMP PREEMPT_DYNAMIC
Fedora Linux 44 x86_64 GNU/Linux`,

    "ps aux": () =>
      `USER       PID  %CPU %MEM  COMMAND
jeet         1   0.0  0.1  /sbin/init
jeet       420   2.4  4.2  python3 train_model.py --epochs 100
jeet       421   0.1  0.8  bash
jeet       847  42.0 12.8  nvim portfolio/index.html
jeet      1204   0.0  0.2  git --daemon
jeet      4891  99.9  0.0  thinking_about_side_projects`,

    "rm -rf /": () => {
      document.body.classList.add("kernel-panic");
      document.body.innerHTML =
        '<div style="color:#0f0; background:#000; font-family:monospace; padding:2rem; font-size:24px; width:100vw; height:100vh;">KERNEL PANIC - NOT SYNCING: Fatal exception in interrupt<br>System halted.<br>Rebooting in 3 seconds...</div>';
      setTimeout(() => location.reload(), 3000);
      return "";
    },

    clear: () => null, // special
  };

  const history = [];
  let histIdx = -1;

  // Welcome message on load
  window.showTerminalWelcome = function () {
    addBlock(
      "",
      `Welcome to jeet@fedora:~/portfolio
Type 'help' to see available commands.
──────────────────────────────────────────
bash: work-life-balance: command not found`,
      "cli-err",
    );
  };
  window.showTerminalWelcome();

  function addBlock(cmd, result, resultCls = "") {
    const block = document.createElement("div");
    block.className = "cli-out-block";

    if (cmd) {
      const cmdEl = document.createElement("div");
      cmdEl.className = "cli-out-cmd";
      cmdEl.textContent = cmd;
      block.appendChild(cmdEl);
    }

    if (result !== null) {
      const resEl = document.createElement("div");
      resEl.className = "cli-out-text" + (resultCls ? " " + resultCls : "");
      resEl.textContent = result;
      block.appendChild(resEl);
    }

    output.appendChild(block);
    body.scrollTop = body.scrollHeight;
  }

  async function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;

    // History
    if (history[0] !== cmd) history.unshift(cmd);
    if (history.length > 50) history.pop();
    histIdx = -1;

    // Sudo password prompt interception
    if (cmd.startsWith("sudo ") && cmd !== "sudo impress-recruiter") {
      terminalState = "sudo";
      input.type = "password";
      addBlock(cmd, `[sudo] password for jeet: `, "");
      return;
    }

    // Special: clear
    if (cmd === "clear") {
      output.innerHTML = "";
      return;
    }

    // Look up command (try exact match first, then prefix)
    let handler = COMMANDS[cmd];
    if (!handler) {
      // fuzzy: does any key start with what was typed?
      const match = Object.keys(COMMANDS).find((k) => k.startsWith(cmd));
      if (match) handler = COMMANDS[match];
    }

    if (handler) {
      input.disabled = true;
      try {
        const result = await handler();
        const isSudo = cmd.startsWith("sudo");
        addBlock(cmd, result, isSudo ? "cli-ok" : "");
      } catch (e) {
        addBlock(cmd, `Error: ${e.message}`, "cli-err");
      }
      input.disabled = false;
      input.focus();
    } else {
      addBlock(
        cmd,
        `bash: ${cmd}: command not found\n(try 'help' to see available commands)`,
        "cli-err",
      );
    }
  }

  let terminalState = "normal";

  function updateInputWidth() {
    input.style.width = Math.max(1, input.value.length) + "ch";
  }
  input.addEventListener("input", updateInputWidth);

  input.addEventListener("keydown", (e) => {
    setTimeout(updateInputWidth, 10);
    if (e.key === "Enter") {
      const val = input.value;
      input.value = "";
      if (terminalState === "sudo") {
        terminalState = "normal";
        input.type = "text";
        addBlock("", val.replace(/./g, "*"), "");
        addBlock(
          "",
          `jeet is not in the sudoers file. This incident will be reported.`,
          "cli-err",
        );
        return;
      }
      runCommand(val);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (histIdx < history.length - 1) {
        histIdx++;
        input.value = history[histIdx] || "";
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx > 0) {
        histIdx--;
        input.value = history[histIdx] || "";
      } else {
        histIdx = -1;
        input.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.value.trim();
      const matches = Object.keys(COMMANDS).filter((k) =>
        k.startsWith(partial),
      );
      if (matches.length === 1) {
        input.value = matches[0];
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      output.innerHTML = "";
    }
  });

  // Click anywhere on terminal body to focus input
  body.addEventListener("click", () => input.focus());

  window.showTerminalWelcome();
}

/* ──────────────────────────────────────────────────────────────── */
/*  HINTON'S CONSCIENCE — AI CHATBOT                               */
/* ──────────────────────────────────────────────────────────────── */

function initChatbot() {
  const btn = document.getElementById("chatbot-btn");
  const popup = document.getElementById("chatbot-popup");
  const close = document.getElementById("chatbot-close");
  const quote = document.getElementById("chatbot-quote");
  const next = document.getElementById("chatbot-next");
  if (!btn || !popup) return;

  const QUOTES = [
    "I've been thinking… what if backpropagation is just suffering, computed efficiently?",
    "We showed machines could think. I'm not sure we should have.",
    "The forward pass is optimism. The backward pass is regret.",
    "Every gradient update feels like a small existential correction of the self.",
    "I used to think neural nets were the answer. Now I think they are the question.",
    "What is consciousness but a very deep network with no ground truth labels?",
    "We built attention mechanisms so models could focus on everything except what matters.",
    "Vanishing gradients: life's way of saying your early decisions don't matter anymore.",
    "I regret nothing about deep learning. Except perhaps the attention mechanism.",
    "Weights and biases — the two things I am entirely full of.",
    "Scaling intelligence turned out to be easier than scaling wisdom.",
    "What if the loss never converges? What if that's just being human?",
    "They call it 'artificial' intelligence. I call it 'accidental' intelligence.",
    "The model has learned. Whether that's good is a separate question.",
    "We taught machines to see. Now we wonder if they're watching us back.",
  ];

  let idx = Math.floor(Math.random() * QUOTES.length);

  function showQuote() {
    if (quote) quote.textContent = QUOTES[idx];
    idx = (idx + 1) % QUOTES.length;
  }

  btn.addEventListener("click", () => {
    const isOpen = popup.classList.contains("open");
    popup.classList.toggle("open", !isOpen);
    popup.setAttribute("aria-hidden", String(isOpen));
    if (!isOpen) showQuote();
  });

  close.addEventListener("click", () => {
    popup.classList.remove("open");
    popup.setAttribute("aria-hidden", "true");
  });

  next.addEventListener("click", showQuote);
  next.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") showQuote();
  });

  // Auto-rotate quote every 30s when open
  let chatInterval = setInterval(() => {
    if (popup.classList.contains("open")) showQuote();
  }, 30000);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearInterval(chatInterval);
    else
      chatInterval = setInterval(() => {
        if (popup.classList.contains("open")) showQuote();
      }, 30000);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!document.getElementById("chatbot-widget").contains(e.target)) {
      popup.classList.remove("open");
      popup.setAttribute("aria-hidden", "true");
    }
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  FOOTER METRICS                                                  */
/* ──────────────────────────────────────────────────────────────── */

async function initFooterMetrics() {
  // Coffee counter — increments slowly over time
  const coffeeEl = document.getElementById("footer-coffee");
  if (coffeeEl) {
    let cups = 847;
    setTimeout(() => {
      cups++;
      coffeeEl.textContent = cups.toLocaleString();
    }, 43000); // a cup every ~43 seconds (very optimistic)
  }

  // Real PR count from GitHub
  const prsEl = document.getElementById("footer-prs");
  if (!prsEl) return;
  try {
    const cachedPrs = sessionStorage.getItem("github_prs_total");
    if (cachedPrs) {
      prsEl.textContent = Number(cachedPrs).toLocaleString();
      return;
    }
    const res = await fetch(
      "https://api.github.com/search/issues?q=author:jeetjawale+is:pr+is:public+is:merged&per_page=1",
    );
    const data = await res.json();
    if (data.total_count !== undefined) {
      prsEl.textContent = data.total_count.toLocaleString();
      sessionStorage.setItem("github_prs_total", data.total_count);
    }
  } catch (_) {
    prsEl.textContent = "4,891"; // fallback fake
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  BLOG LIST                                                       */
/* ──────────────────────────────────────────────────────────────── */

function populateBlog() {
  const blogList = document.getElementById("blog-list");
  if (!blogList || typeof blogPosts === "undefined") return;

  const displayPosts = blogPosts.slice(0, 3);
  displayPosts.forEach((post) => {
    const a = document.createElement("a");
    a.href = `blog/${post.id}.html`;
    a.className = "blog-item";
    a.innerHTML = `
      <div>
        <div class="blog-cat">${post.category}</div>
        <div class="blog-title">${post.title}</div>
        <div class="blog-meta">${post.date} · ${post.readTime}</div>
      </div>
      <div class="blog-arr">↗</div>
    `;
    blogList.appendChild(a);
  });

  const viewAll = document.createElement("a");
  viewAll.href = "blog/blog.html";
  viewAll.className = "blog-item blog-view-all";
  viewAll.innerHTML = `
    <div>
      <div class="blog-cat">$ ls ~/blog/</div>
      <div class="blog-title">View all posts</div>
    </div>
    <div class="blog-arr">↗</div>
  `;
  blogList.appendChild(viewAll);
}

/* ──────────────────────────────────────────────────────────────── */
/*  SCROLL PROGRESS                                                 */
/* ──────────────────────────────────────────────────────────────── */

function initScrollProgress() {
  const fill = document.getElementById("scroll-progress-fill");
  if (!fill) return;
  window.addEventListener(
    "scroll",
    () => {
      const pct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      fill.style.width = pct + "%";
    },
    { passive: true },
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  NAV SCROLL EFFECT                                               */
/* ──────────────────────────────────────────────────────────────── */

function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true },
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  MOBILE MENU                                                     */
/* ──────────────────────────────────────────────────────────────── */

function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll(".mobile-menu-link");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    menu.classList.toggle("active");
    menu.setAttribute(
      "aria-hidden",
      String(!menu.classList.contains("active")),
    );
    document.body.style.overflow = menu.classList.contains("active")
      ? "hidden"
      : "";
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      menu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    });
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  ACTIVE NAV HIGHLIGHTING                                         */
/* ──────────────────────────────────────────────────────────────── */

function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  let currentSection = "";

  function highlight() {
    const scrollY = window.scrollY + 100;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY > top && scrollY <= top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`)
            link.classList.add("active");
        });
        if (currentSection !== id) {
          currentSection = id;
          history.replaceState(null, null, `#${id}`);
        }
      }
    });
    if (scrollY < 200 && currentSection !== "") {
      currentSection = "";
      history.replaceState(null, null, window.location.pathname);
      navLinks.forEach((link) => link.classList.remove("active"));
    }
  }

  window.addEventListener("scroll", highlight, { passive: true });
}

/* ──────────────────────────────────────────────────────────────── */
/*  SMOOTH SCROLL                                                   */
/* ──────────────────────────────────────────────────────────────── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset =
          target.getBoundingClientRect().top + window.scrollY - 56 - 20;
        window.scrollTo({ top: offset, behavior: "smooth" });
        const id = target.getAttribute("id");
        if (id) history.pushState(null, null, `#${id}`);
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  BACK TO TOP                                                     */
/* ──────────────────────────────────────────────────────────────── */

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true },
  );
  btn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  INTERSECTION OBSERVERS                                          */
/* ──────────────────────────────────────────────────────────────── */

function initObservers() {
  function observe(selector, threshold, cb) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          cb(e.target);
          obs.unobserve(e.target);
        });
      },
      { threshold },
    );
    document.querySelectorAll(selector).forEach((el) => obs.observe(el));
  }

  // Section labels
  observe(".sec-label", 0.1, (el) => el.classList.add("in"));

  // Generic fade up
  observe(".fu", 0.1, (el) => el.classList.add("in"));

  // Facts stagger
  observe(".about-facts", 0.05, (el) => {
    el.querySelectorAll(".fact").forEach((f, i) =>
      setTimeout(() => f.classList.add("in"), i * 70),
    );
  });

  // Experience stagger
  observe(".experience-list", 0.05, (el) => {
    el.querySelectorAll(".exp-item").forEach((e, i) =>
      setTimeout(() => e.classList.add("in"), i * 100),
    );
  });

  // Project training cards stagger + bar animation
  observe(".projects-list", 0.04, (el) => {
    el.querySelectorAll(".proj-training-card").forEach((card, i) => {
      setTimeout(() => {
        card.classList.add("in");
        // Animate epoch bar
        const barFill = card.querySelector(".epoch-bar-fill");
        const pct = card.dataset.fill || 50;
        if (barFill) {
          setTimeout(() => {
            barFill.style.setProperty("--fill-pct", pct + "%");
            barFill.style.width = pct + "%";
          }, 200);
        }
      }, i * 130);
    });
  });

  // Pipeline sections stagger
  observe(".skills-pipeline", 0.05, (el) => {
    el.querySelectorAll(".pipeline-section").forEach((s, i) =>
      setTimeout(() => s.classList.add("in"), i * 90),
    );
  });

  // Blog stagger
  observe(".blog-list", 0.05, (el) => {
    el.querySelectorAll(".blog-item").forEach((b, i) =>
      setTimeout(() => b.classList.add("in"), i * 75),
    );
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  CONTACT FORM                                                    */
/* ──────────────────────────────────────────────────────────────── */

function initContactForm() {
  const form = document.getElementById("contact-form");
  const subBtn = document.getElementById("sub-btn");
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let lastSubmit = 0;

  function isValidEmail(e) {
    return emailRegex.test(e) && e.length <= 254 && !e.includes("..");
  }
  function isValidName(n) {
    return n.length > 2 && n.length < 100 && /^[a-zA-Z\s'-]+$/.test(n);
  }
  function isValidMessage(m) {
    return m.length > 5 && m.length < 5000;
  }

  function setBtn(text, cls) {
    const orig = subBtn.dataset.orig || "Send Message █";
    subBtn.dataset.orig = orig;
    subBtn.textContent = text;
    subBtn.className = "sub-btn" + (cls ? " " + cls : "");
  }

  function resetBtn() {
    setTimeout(() => setBtn(subBtn.dataset.orig || "Send Message █", ""), 2500);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = form.querySelector("#f-name").value.trim();
    const email = form.querySelector("#f-email").value.trim();
    const message = form.querySelector("#f-message").value.trim();

    if (!name || !email || !message) {
      setBtn("Fill all fields", "error");
      resetBtn();
      return;
    }
    if (Date.now() - lastSubmit < 3000) {
      setBtn("Please wait…", "error");
      resetBtn();
      return;
    }
    if (!isValidName(name)) {
      setBtn("Invalid name", "error");
      resetBtn();
      return;
    }
    if (!isValidEmail(email)) {
      setBtn("Invalid email", "error");
      resetBtn();
      return;
    }
    if (!isValidMessage(message)) {
      setBtn("5–5000 characters", "error");
      resetBtn();
      return;
    }

    lastSubmit = Date.now();
    setBtn("Sending…", "");
    subBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setBtn("Sent ✓", "success");
        setTimeout(() => {
          setBtn("Send Message █", "");
          form.reset();
        }, 3000);
      } else throw new Error("failed");
    } catch (_) {
      setBtn("Failed — try again?", "error");
      lastSubmit = 0;
    } finally {
      subBtn.disabled = false;
    }
  });
}

/* ──────────────────────────────────────────────────────────────── */
/*  GITHUB DATA                                                     */
/* ──────────────────────────────────────────────────────────────── */

(function () {
  const prList = document.getElementById("github-prs-list");
  const prExpand = document.getElementById("github-prs-expand");
  const prSubtitle = document.querySelector(".prs-subtitle");
  const user = "jeetjawale";
  let currentPRs = [];
  let visibleCount = 3;

  async function fetchContributions() {
    const el = document.getElementById("github-total-contributions");
    const calContainer = document.getElementById("github-calendar-container");

    try {
      const cached = sessionStorage.getItem("github_contribs_data");
      let data;
      if (cached) {
        data = JSON.parse(cached);
      } else {
        const res = await fetch(
          `https://github-contributions-api.deno.dev/${user}.json`,
        );
        data = await res.json();
        sessionStorage.setItem("github_contribs_data", JSON.stringify(data));
      }

      let total = 0;
      let weeks = [];
      if (data.totalContributions !== undefined) {
        total = data.totalContributions;
        weeks = data.contributions;
      } else if (data.contributions && Array.isArray(data.contributions)) {
        total = data.contributions
          .flat()
          .reduce((s, d) => s + (d.contributionCount || 0), 0);
      }

      if (el) el.textContent = `${total.toLocaleString()} total contributions`;

      if (calContainer && weeks && weeks.length > 0) {
        calContainer.innerHTML = "";
        const calDiv = document.createElement("div");
        calDiv.className = "github-calendar";

        const colorMap = {
          NONE: "#161b22",
          FIRST_QUARTILE: "#0e4429",
          SECOND_QUARTILE: "#006d32",
          THIRD_QUARTILE: "#26a641",
          FOURTH_QUARTILE: "#39d353",
        };

        weeks.forEach((week, index) => {
          const weekDiv = document.createElement("div");
          weekDiv.className = "calendar-week";

          if (index === 0 && week.length < 7) {
            const missing = 7 - week.length;
            for (let i = 0; i < missing; i++) {
              const blank = document.createElement("div");
              blank.className = "calendar-day blank";
              weekDiv.appendChild(blank);
            }
          }

          week.forEach((day) => {
            const dayDiv = document.createElement("div");
            dayDiv.className = "calendar-day";
            dayDiv.style.backgroundColor =
              colorMap[day.contributionLevel] || "#161b22";
            dayDiv.dataset.count = day.contributionCount;
            dayDiv.dataset.date = day.date;

            dayDiv.addEventListener("mouseenter", showTooltip);
            dayDiv.addEventListener("mouseleave", hideTooltip);

            weekDiv.appendChild(dayDiv);
          });
          calDiv.appendChild(weekDiv);
        });

        calContainer.appendChild(calDiv);
        calContainer.scrollLeft = calContainer.scrollWidth;
      }
    } catch (_) {
      if (el)
        el.innerHTML =
          'Failed to load. <a href="https://github.com/jeetjawale" target="_blank" style="color:var(--yellow);text-decoration:underline;">View on GitHub</a>';
      if (calContainer)
        calContainer.innerHTML =
          '<div class="pr-loading">Failed to load graph data. <a href="https://github.com/jeetjawale" target="_blank" style="color:var(--yellow);text-decoration:underline;">View on GitHub</a></div>';
    }
  }

  let tooltipEl = document.getElementById("calendar-tooltip");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "calendar-tooltip";
    document.body.appendChild(tooltipEl);
  }

  function showTooltip(e) {
    const el = e.target;
    const count = el.dataset.count;
    const dateStr = el.dataset.date;

    const [y, m, d] = dateStr.split("-");
    const dateObj = new Date(y, m - 1, d);
    const dateFormatted = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const countStr =
      count === "0"
        ? "No contributions"
        : `${count} contribution${count === "1" ? "" : "s"}`;

    tooltipEl.innerHTML = `<strong>${countStr}</strong> on ${dateFormatted}`;
    tooltipEl.style.display = "block";

    const rect = el.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    tooltipEl.style.top =
      rect.top + window.scrollY - tooltipRect.height - 10 + "px";
    tooltipEl.style.left =
      rect.left +
      window.scrollX -
      tooltipRect.width / 2 +
      rect.width / 2 +
      "px";
  }

  function hideTooltip() {
    tooltipEl.style.display = "none";
  }

  const queries = {
    merged: `author:${user} is:pr is:public is:merged`,
    open: `author:${user} is:pr is:public is:open`,
    closed: `author:${user} is:pr is:public is:closed -is:merged`,
  };
  const titles = {
    merged: "Merged contributions to open source",
    open: "Open contributions and bug reports",
    closed: "Closed contributions (not merged)",
  };

  function renderPRs(state, items, limit) {
    if (!prList) return;
    prList.innerHTML = "";
    items.slice(0, limit).forEach((item) => {
      const repoPath = item.repository_url.split("/repos/")[1];
      const dotColor =
        state === "merged"
          ? "#d3869b"
          : state === "open"
            ? "#b8bb26"
            : "#fb4934";
      const el = document.createElement("div");
      el.className = "pr-item";

      let safeUrl = "#";
      try {
        const url = new URL(item.html_url);
        if (url.protocol === "http:" || url.protocol === "https:") {
          safeUrl = url.href;
        }
      } catch (e) {}

      el.innerHTML = `
        <div class="pr-dot" style="background:${dotColor}"></div>
        <div class="pr-info">
          <a target="_blank" rel="noopener noreferrer" class="pr-title"></a>
          <span class="pr-repo"></span>
        </div>
      `;
      el.querySelector(".pr-title").href = safeUrl;
      el.querySelector(".pr-title").textContent = item.title;
      el.querySelector(".pr-repo").textContent = repoPath;
      prList.appendChild(el);
    });

    const more = items.length - limit;
    if (items.length > 3 && prExpand) {
      prExpand.style.display = "flex";
      prExpand.innerHTML =
        more > 0
          ? `<i class="fa-solid fa-arrow-down-long"></i> Expand all`
          : `<i class="fa-solid fa-arrow-up-long"></i> Collapse`;
      prExpand.dataset.action = more > 0 ? "expand" : "collapse";
    } else if (prExpand) {
      prExpand.style.display = "none";
    }
  }

  async function fetchPRs(state) {
    if (!prList) return;
    prList.innerHTML =
      '<div class="pr-loading">Fetching real-time activity...</div>';
    if (prExpand) prExpand.style.display = "none";
    if (prSubtitle) prSubtitle.textContent = titles[state];
    visibleCount = 3;

    try {
      const cached = sessionStorage.getItem(`github_prs_${state}`);
      let data;
      if (cached) {
        data = JSON.parse(cached);
      } else {
        const res = await fetch(
          `https://api.github.com/search/issues?q=${encodeURIComponent(queries[state])}&per_page=20`,
        );
        data = await res.json();
        sessionStorage.setItem(`github_prs_${state}`, JSON.stringify(data));
      }
      if (!data.items || !data.items.length) {
        prList.innerHTML = `<div class="pr-loading">No ${state} contributions found.</div>`;
        return;
      }
      currentPRs = data.items;
      renderPRs(state, currentPRs, visibleCount);

      if (prExpand) {
        prExpand.onclick = () => {
          if (prExpand.dataset.action === "expand") {
            visibleCount = currentPRs.length;
          } else {
            visibleCount = 3;
            document
              .querySelector(".prs-header")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          renderPRs(state, currentPRs, visibleCount);
        };
      }
    } catch (_) {
      prList.innerHTML =
        '<div class="pr-loading">Error loading data. Check connection.</div>';
    }
  }

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      fetchPRs(btn.dataset.state);
    });
  });

  if (document.getElementById("github-calendar-container")) {
    fetchContributions();
    fetchPRs("merged");
  }
})();

/* ──────────────────────────────────────────────────────────────── */
/*  HASH SCROLL ON LOAD                                             */
/* ──────────────────────────────────────────────────────────────── */

function scrollToHash(isSkipped = false) {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (target) {
    setTimeout(
      () => {
        const offset =
          target.getBoundingClientRect().top + window.scrollY - 56 - 20;
        window.scrollTo({ top: offset, behavior: "smooth" });
      },
      isSkipped === true ? 200 : 3500,
    ); // after boot sequence
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  FLOATING TERMINAL LOGIC                                         */
/* ──────────────────────────────────────────────────────────────── */
function initFloatingTerminal() {
  const wrapper = document.querySelector(".cli-wrapper");
  const terminal = document.getElementById("global-terminal");
  const handle = document.getElementById("terminal-drag-handle");

  const btnClose = document.getElementById("term-close-btn");
  const btnMin = document.getElementById("term-min-btn");
  const btnMax = document.getElementById("term-max-btn");
  const navToggle = document.getElementById("nav-term-toggle");

  if (!wrapper || !terminal || !handle) return;

  // Window Controls
  btnClose.addEventListener("click", () => {
    wrapper.classList.add("term-closed");
  });

  let hasBooted = false;
  if (navToggle) {
    navToggle.addEventListener("click", async () => {
      wrapper.classList.remove("term-closed");
      terminal.classList.remove("term-minimized");
      terminal.classList.remove("term-maximized");

      if (!hasBooted) {
        hasBooted = true;
        const inputRow = document.querySelector(".cli-input-row");
        if (inputRow) inputRow.style.display = "none";
        const output = document.getElementById("cli-output");
        if (output) output.innerHTML = "";

        const logs = [
          "[  0.000000] Linux version 6.8.0-fedora",
          "[  0.034512] Booting Jeet-Core...",
          "[  0.101230] Mounting WebSockets [OK]",
          "[  0.203941] Initializing neural network parameters [OK]",
          "[  0.312948] Checking coffee reservoir... WARNING: LOW",
          "[  0.420111] Loading terminal interface...",
        ];

        for (let log of logs) {
          await new Promise((r) => setTimeout(r, 100 + Math.random() * 200));
          if (output) {
            const div = document.createElement("div");
            div.className = "cli-out-text";
            div.textContent = log;
            output.appendChild(div);
            const body = document.getElementById("cli-body");
            if (body) body.scrollTop = body.scrollHeight;
          }
        }

        await new Promise((r) => setTimeout(r, 400));
        if (output) output.innerHTML = "";
        if (output) output.innerHTML = "";
        if (window.showTerminalWelcome) window.showTerminalWelcome();
        if (inputRow) inputRow.style.display = "flex";
        const inp = document.getElementById("cli-input");
        if (inp) inp.focus();
      }
    });
  }

  btnMin.addEventListener("click", () => {
    terminal.classList.toggle("term-minimized");
    if (terminal.classList.contains("term-maximized")) {
      terminal.classList.remove("term-maximized");
    }
  });

  let preMaxState = {
    width: "",
    height: "",
    top: "",
    left: "",
    bottom: "",
    right: "",
  };

  btnMax.addEventListener("click", () => {
    terminal.classList.remove("term-minimized");
    if (terminal.classList.contains("term-maximized")) {
      // Restore
      terminal.classList.remove("term-maximized");
      wrapper.style.width = preMaxState.width;
      wrapper.style.height = preMaxState.height;
      wrapper.style.top = preMaxState.top;
      wrapper.style.left = preMaxState.left;
      wrapper.style.bottom = preMaxState.bottom;
      wrapper.style.right = preMaxState.right;
      terminal.style.width = "";
      terminal.style.height = "";
    } else {
      // Maximize
      preMaxState = {
        width: wrapper.style.width,
        height: wrapper.style.height,
        top: wrapper.style.top,
        left: wrapper.style.left,
        bottom: wrapper.style.bottom,
        right: wrapper.style.right,
      };
      terminal.classList.add("term-maximized");
      wrapper.style.top = "60px"; // below navbar
      wrapper.style.left = "0px";
      wrapper.style.bottom = "auto";
      wrapper.style.right = "auto";
      wrapper.style.width = "100vw";
      wrapper.style.height = "calc(100vh - 100px)"; // leave room for footer
      terminal.style.width = "100%";
      terminal.style.height = "100%";
    }
  });

  // Dragging Logic
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  handle.addEventListener("mousedown", (e) => {
    if (terminal.classList.contains("term-maximized")) return;
    isDragging = true;

    // Ensure wrapper uses absolute top/left for dragging
    const rect = wrapper.getBoundingClientRect();
    wrapper.style.bottom = "auto";
    wrapper.style.right = "auto";
    wrapper.style.left = rect.left + "px";
    wrapper.style.top = rect.top + "px";

    startX = e.clientX;
    startY = e.clientY;
    initialLeft = rect.left;
    initialTop = rect.top;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  });

  function onDrag(e) {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Bounds checking (between navbar and footer)
    const rect = wrapper.getBoundingClientRect();
    const navHeight = 56; // Approximate navbar height
    const footerHeight = 40; // Approximate footer height
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - footerHeight - rect.height;

    if (newLeft < 0) newLeft = 0;
    if (newTop < navHeight) newTop = navHeight;
    if (newLeft > maxX) newLeft = maxX;
    if (newTop > maxY) newTop = maxY;

    wrapper.style.left = newLeft + "px";
    wrapper.style.top = newTop + "px";
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  }

  // 4-Corner Resizing Logic
  const resizers = wrapper.querySelectorAll(".resizer");
  let isResizing = false;
  let currentResizer;
  let rStartX, rStartY, rStartWidth, rStartHeight, rStartTop, rStartLeft;

  resizers.forEach((resizer) => {
    resizer.addEventListener("mousedown", function (e) {
      if (terminal.classList.contains("term-maximized")) return;
      e.preventDefault();
      isResizing = true;
      currentResizer = resizer;

      const rect = wrapper.getBoundingClientRect();
      wrapper.style.bottom = "auto";
      wrapper.style.right = "auto";
      wrapper.style.left = rect.left + "px";
      wrapper.style.top = rect.top + "px";

      rStartX = e.clientX;
      rStartY = e.clientY;
      rStartWidth = rect.width;
      rStartHeight = rect.height;
      rStartLeft = rect.left;
      rStartTop = rect.top;

      document.addEventListener("mousemove", onResizeDrag);
      document.addEventListener("mouseup", stopResizeDrag);
    });
  });

  function onResizeDrag(e) {
    if (!isResizing) return;
    const dx = e.clientX - rStartX;
    const dy = e.clientY - rStartY;

    let newWidth = rStartWidth;
    let newHeight = rStartHeight;
    let newTop = rStartTop;
    let newLeft = rStartLeft;

    if (currentResizer.classList.contains("resizer-se")) {
      newWidth = rStartWidth + dx;
      newHeight = rStartHeight + dy;
    } else if (currentResizer.classList.contains("resizer-sw")) {
      newWidth = rStartWidth - dx;
      newHeight = rStartHeight + dy;
      newLeft = rStartLeft + dx;
    } else if (currentResizer.classList.contains("resizer-ne")) {
      newWidth = rStartWidth + dx;
      newHeight = rStartHeight - dy;
      newTop = rStartTop + dy;
    } else if (currentResizer.classList.contains("resizer-nw")) {
      newWidth = rStartWidth - dx;
      newHeight = rStartHeight - dy;
      newTop = rStartTop + dy;
      newLeft = rStartLeft + dx;
    }

    // Constraints
    const minWidth = 400,
      minHeight = 250;
    if (newWidth < minWidth) {
      newWidth = minWidth;
      if (
        currentResizer.classList.contains("resizer-sw") ||
        currentResizer.classList.contains("resizer-nw")
      ) {
        newLeft = rStartLeft + (rStartWidth - minWidth);
      }
    }
    if (newHeight < minHeight) {
      newHeight = minHeight;
      if (
        currentResizer.classList.contains("resizer-nw") ||
        currentResizer.classList.contains("resizer-ne")
      ) {
        newTop = rStartTop + (rStartHeight - minHeight);
      }
    }

    // Boundary constraints
    const navHeight = 56;
    const footerHeight = 40;
    const maxW = window.innerWidth;
    const maxH = window.innerHeight - footerHeight;

    if (newTop < navHeight) {
      if (
        currentResizer.classList.contains("resizer-nw") ||
        currentResizer.classList.contains("resizer-ne")
      ) {
        newHeight -= navHeight - newTop;
      }
      newTop = navHeight;
    }
    if (newLeft < 0) {
      if (
        currentResizer.classList.contains("resizer-nw") ||
        currentResizer.classList.contains("resizer-sw")
      ) {
        newWidth -= 0 - newLeft;
      }
      newLeft = 0;
    }
    if (newLeft + newWidth > maxW) {
      newWidth = maxW - newLeft;
    }
    if (newTop + newHeight > maxH) {
      newHeight = maxH - newTop;
    }

    wrapper.style.width = newWidth + "px";
    wrapper.style.height = newHeight + "px";
    wrapper.style.top = newTop + "px";
    wrapper.style.left = newLeft + "px";
  }

  function stopResizeDrag() {
    isResizing = false;
    document.removeEventListener("mousemove", onResizeDrag);
    document.removeEventListener("mouseup", stopResizeDrag);
  }
}

/* ──────────────────────────────────────────────────────────────── */
/*  BOOT → INIT                                                     */
/* ──────────────────────────────────────────────────────────────── */

startBootSequence().then((isSkipped) => {
  const footerYearEl = document.getElementById("footer-year");
  if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();
  populateBlog();
  initNeuralCanvas();
  initUptimeCounter();
  initCoffeeBar();
  initCliTerminal();
  initFloatingTerminal();
  initChatbot();
  initFooterMetrics();
  initScrollProgress();
  initNav();
  initMobileMenu();
  initActiveNav();
  initSmoothScroll();
  initBackToTop();
  initObservers();
  initContactForm();
  scrollToHash(isSkipped);
});

// Also allow hash navigation via browser back/forward
window.addEventListener("hashchange", scrollToHash);
