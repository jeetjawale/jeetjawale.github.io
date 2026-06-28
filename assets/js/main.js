'use strict';

/* ============================================================
   1. Neural Network Canvas
   ============================================================ */
function initNeuralCanvas() {
  const canvas = document.getElementById('nn-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const CFG = {
    numNodes: window.innerWidth < 768 ? 32 : 80,
    connDist: 190,
    nodeRadius: { min: 1, max: 3.5 },
    speed: 0.28,
    activateEvery: 2000,
    hoverRadius: 110,
    nodeColor: [250, 189, 47],
    edgeColor: [131, 165, 152],
    pulseColor: [254, 128, 25],
  };

  let W, H;
  const nodes = [];
  let mouseX = -9999, mouseY = -9999;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function makeNodes() {
    nodes.length = 0;
    for (let i = 0; i < CFG.numNodes; i++) {
      nodes.push({ 
        x: -50 + Math.random() * (W + 100), 
        y: -50 + Math.random() * (H + 100), 
        vx: (Math.random() - 0.5) * CFG.speed, 
        vy: (Math.random() - 0.5) * CFG.speed, 
        r: CFG.nodeRadius.min + Math.random() * (CFG.nodeRadius.max - CFG.nodeRadius.min), 
        act: 0 
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    const time = Date.now() * 0.001;
    const breatheScale = 1 + Math.sin(time * 0.8) * 0.03; 
    const breatheAlpha = 0.85 + Math.sin(time * 0.8) * 0.15; 
    
    // Parallax logic
    let px = 0, py = 0;
    if (mouseX !== -9999) {
      px = (mouseX - W / 2) * 0.025; // 2.5% parallax offset
      py = (mouseY - H / 2) * 0.025;
    }
    
    ctx.save();
    ctx.globalAlpha = breatheAlpha;
    
    // Center, apply breathing scale, uncenter, then apply parallax
    ctx.translate(W / 2, H / 2);
    ctx.scale(breatheScale, breatheScale);
    ctx.translate(-W / 2, -H / 2);
    ctx.translate(-px, -py);

    for (const n of nodes) { 
      n.x += n.vx; n.y += n.vy; 
      if (n.x < -50 || n.x > W + 50) n.vx *= -1; 
      if (n.y < -50 || n.y > H + 50) n.vy *= -1; 
      n.act = Math.max(0, n.act - 0.018); 
    }
    for (const n of nodes) { 
      const adjMouseX = mouseX + px;
      const adjMouseY = mouseY + py;
      const dx = n.x - adjMouseX, dy = n.y - adjMouseY; 
      const dist = Math.sqrt(dx * dx + dy * dy); 
      if (dist < CFG.hoverRadius) { n.act = Math.max(n.act, 1 - dist / CFG.hoverRadius); } 
    }
    const [er, eg, eb] = CFG.edgeColor;
    for (let i = 0; i < nodes.length; i++) { for (let j = i + 1; j < nodes.length; j++) { const a = nodes[i], b = nodes[j]; const dx = b.x - a.x, dy = b.y - a.y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < CFG.connDist) { const weight = 1 - dist / CFG.connDist; const actBoost = (a.act + b.act) * 0.3; const alpha = weight * 0.12 + actBoost; ctx.beginPath(); ctx.strokeStyle = `rgba(${er},${eg},${eb},${Math.min(alpha, 0.65)})`; ctx.lineWidth = weight * 0.8 + actBoost; ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } } }
    const [nr, ng, nb] = CFG.nodeColor;
    const [pr, pg, pb] = CFG.pulseColor;
    for (const n of nodes) { const baseAlpha = 0.25 + n.act * 0.7; const radius = n.r + n.act * 4; if (n.act > 0.1) { const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4); grad.addColorStop(0, `rgba(${pr},${pg},${pb},${n.act * 0.4})`); grad.addColorStop(1, `rgba(${pr},${pg},${pb},0)`); ctx.beginPath(); ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill(); } ctx.beginPath(); ctx.arc(n.x, n.y, radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(${nr},${ng},${nb},${baseAlpha})`; ctx.fill(); }
    
    ctx.restore();
    animId = requestAnimationFrame(draw);
  }

  function triggerPulse() {
    const source = nodes[Math.floor(Math.random() * nodes.length)];
    source.act = 1;
    for (const n of nodes) { const dx = n.x - source.x, dy = n.y - source.y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < CFG.connDist && n !== source) { setTimeout(() => { n.act = Math.max(n.act, 0.75 * (1 - dist / CFG.connDist)); }, 50 + dist * 0.6); } }
  }
  let pulseId = setInterval(triggerPulse, CFG.activateEvery);
  let animId;

  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(animId); clearInterval(pulseId); } else { draw(); pulseId = setInterval(triggerPulse, CFG.activateEvery); } });
  window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  resize(); makeNodes(); draw();
  window.addEventListener('resize', () => { resize(); makeNodes(); }, { passive: true });
}

/* ============================================================
   2. Tab Switching
   ============================================================ */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panes = document.querySelectorAll('.tab-pane');

  function switchTab(tabName) {
    tabs.forEach(t => { t.classList.toggle('active', t.dataset.tab === tabName); t.setAttribute('aria-selected', t.dataset.tab === tabName); });
    panes.forEach(p => { p.classList.toggle('active', p.id === 'tab-' + tabName); });
    history.replaceState(null, null, '#' + tabName);
  }

  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  // Handle hash on load
  const hash = window.location.hash.replace('#', '');
  const validTabs = ['about', 'experience', 'projects', 'skills', 'blog'];
  if (hash && validTabs.includes(hash)) switchTab(hash);

  window.addEventListener('hashchange', () => {
    const h = window.location.hash.replace('#', '');
    if (h && validTabs.includes(h)) switchTab(h);
  });
}

/* ============================================================
   3. Coffee Bar Animation
   ============================================================ */
function initCoffeeBar() {
  const bar = document.getElementById('coffee-bar');
  const val = document.getElementById('coffee-val');
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffDays = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) || 1;
  if (val) val.textContent = diffDays + ' cups';
  if (bar) setTimeout(() => { const pct = Math.min(100, Math.max(5, (diffDays / 365) * 100)); bar.style.width = pct + '%'; }, 400);
}

/* ============================================================
   4. Blog List Population
   ============================================================ */
function populateBlog() {
  const blogList = document.getElementById('blog-list');
  if (!blogList || typeof blogPosts === 'undefined') return;
  blogPosts.forEach(post => {
    const a = document.createElement('a');
    a.href = `blog/${post.id}.html`;
    a.className = 'blog-item';
    a.innerHTML = `<div><div class="blog-cat">${post.category}</div><div class="blog-title">${post.title}</div><div class="blog-meta">${post.date} · ${post.readTime}</div></div><div class="blog-arr">↗</div>`;
    blogList.appendChild(a);
  });
  const viewAll = document.createElement('a');
  viewAll.href = 'blog/blog.html';
  viewAll.className = 'blog-item blog-view-all';
  viewAll.innerHTML = `<div><div class="blog-cat">$ ls ~/blog/</div><div class="blog-title">View all posts</div></div><div class="blog-arr">↗</div>`;
  blogList.appendChild(viewAll);
}

/* ============================================================
   5. GitHub Contributions Heatmap
   ============================================================ */
(function() {
  const user = 'jeetjawale';
  async function fetchContributions() {
    const el = document.getElementById('github-total-contributions');
    const calContainer = document.getElementById('github-calendar-container');
    try {
      const cached = sessionStorage.getItem('github_contribs_data');
      let data;
      if (cached) { data = JSON.parse(cached); }
      else { const res = await fetch(`https://github-contributions-api.deno.dev/${user}.json`); data = await res.json(); sessionStorage.setItem('github_contribs_data', JSON.stringify(data)); }
      let total = 0; let weeks = [];
      if (data.totalContributions !== undefined) { total = data.totalContributions; weeks = data.contributions; }
      else if (data.contributions && Array.isArray(data.contributions)) { total = data.contributions.flat().reduce((s, d) => s + (d.contributionCount || 0), 0); }
      if (el) el.textContent = `${total.toLocaleString()} total contributions`;
      if (calContainer && weeks && weeks.length > 0) {
        calContainer.innerHTML = '';
        const calDiv = document.createElement('div'); calDiv.className = 'github-calendar';
        const colorMap = { NONE: '#161b22', FIRST_QUARTILE: '#0e4429', SECOND_QUARTILE: '#006d32', THIRD_QUARTILE: '#26a641', FOURTH_QUARTILE: '#39d353' };
        weeks.forEach((week, index) => {
          const weekDiv = document.createElement('div'); weekDiv.className = 'calendar-week';
          if (index === 0 && week.length < 7) { for (let i = 0; i < 7 - week.length; i++) { const blank = document.createElement('div'); blank.className = 'calendar-day blank'; weekDiv.appendChild(blank); } }
          week.forEach(day => {
            const dayDiv = document.createElement('div'); dayDiv.className = 'calendar-day';
            dayDiv.style.backgroundColor = colorMap[day.contributionLevel] || '#161b22';
            dayDiv.dataset.count = day.contributionCount; dayDiv.dataset.date = day.date;
            dayDiv.addEventListener('mouseenter', showTooltip); dayDiv.addEventListener('mouseleave', hideTooltip);
            weekDiv.appendChild(dayDiv);
          });
          calDiv.appendChild(weekDiv);
        });
        calContainer.appendChild(calDiv);
        calContainer.scrollLeft = calContainer.scrollWidth;
      }
    } catch (_) {
      if (el) el.innerHTML = 'Failed to load. <a href="https://github.com/jeetjawale" target="_blank" style="color:var(--yellow);text-decoration:underline;">View on GitHub</a>';
      if (calContainer) calContainer.innerHTML = '<div class="gh-loading">Failed to load graph data.</div>';
    }
  }

  let tooltipEl = document.getElementById('calendar-tooltip');
  function showTooltip(e) {
    const el = e.target; const count = el.dataset.count; const dateStr = el.dataset.date;
    const [y, m, d] = dateStr.split('-'); const dateObj = new Date(y, m - 1, d);
    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const countStr = count === '0' ? 'No contributions' : `${count} contribution${count === '1' ? '' : 's'}`;
    tooltipEl.innerHTML = `<strong>${countStr}</strong> on ${dateFormatted}`;
    tooltipEl.style.display = 'block';
    const rect = el.getBoundingClientRect(); const tooltipRect = tooltipEl.getBoundingClientRect();
    tooltipEl.style.top = rect.top + window.scrollY - tooltipRect.height - 10 + 'px';
    tooltipEl.style.left = rect.left + window.scrollX - tooltipRect.width / 2 + rect.width / 2 + 'px';
  }
  function hideTooltip() { tooltipEl.style.display = 'none'; }

  if (document.getElementById('github-calendar-container')) { fetchContributions(); }
})();

/* ============================================================
   6. CLI Easter Egg (toggled with backtick key)
   ============================================================ */
function initCliEasterEgg() {
  const overlay = document.getElementById('cli-overlay');
  const output = document.getElementById('cli-output');
  const input = document.getElementById('cli-input');
  const body = document.getElementById('cli-body');
  const pathEl = document.getElementById('cli-path');
  const closeBtn = document.getElementById('term-close-btn');
  if (!overlay || !output || !input) return;

  // Fake Filesystem
  const FS = {
    '~': {
      type: 'dir',
      contents: {
        'projects': {
          type: 'dir',
          contents: {
            'opteer': { type: 'dir' },
            'heritage-explorer': { type: 'dir' },
            'course-exit-survey': { type: 'dir' },
            'c-learning-app': { type: 'dir' }
          }
        },
        'resume.txt': { 
          type: 'file', 
          content: `NAME:      Jeet Jawale\nDEGREE:    B.Tech. Computer Engineering\nLOCATION:  Navi Mumbai, India\nFOCUS:     Software Engineering · AI · Full-Stack · Automation\n\nSUMMARY:\n  Built a geospatial radiation safety decision-support system at\n  Bhabha Atomic Research Centre (BARC). Currently developing an\n  AI-powered job application platform using LangGraph and FastAPI.\n  Seeking entry-level Software Engineering roles.\n\nEXPERIENCE:\n  BARC, Trombay (Jun–Aug 2025)\n  Project Trainee — Radiation Safety Systems Division\n  → Automated geospatial data processing workflows (Python/PyQGIS)\n  → Developed PyQt desktop interface for radiation safety\n\nPROJECTS:\n  Opteer                 — Next.js / FastAPI / LangGraph / PostgreSQL\n  Heritage Explorer      — QGIS / React / MapLibre / Node.js / Firebase\n\nSTATUS:    ● Open to work\nCONTACT:   mail@jeetjawale.dev` 
        },
        'contact.sh': { 
          type: 'file', 
          content: `#!/bin/bash\necho "Email: mail@jeetjawale.dev"\necho "GitHub: github.com/jeetjawale"\necho "LinkedIn: linkedin.com/in/jeetjawale"` 
        },
        'secrets.gpg': { type: 'file', content: null, denied: true }
      }
    }
  };

  let cwd = ['~']; // Current working directory path

  function getDir(pathArray) {
    let current = FS['~'];
    for (let i = 1; i < pathArray.length; i++) {
      if (current.contents && current.contents[pathArray[i]]) {
        current = current.contents[pathArray[i]];
      } else return null;
    }
    return current;
  }

  function resolvePath(target) {
    if (!target || target === '~') return ['~'];
    if (target === '/') return ['~']; // Treat root as ~ for safety
    
    let parts = target.split('/').filter(p => p !== '');
    let newPath = [...cwd];
    
    if (target.startsWith('/') || target.startsWith('~')) {
      newPath = ['~'];
      if (target.startsWith('~/')) parts = target.substring(2).split('/').filter(p => p !== '');
      else if (target.startsWith('/')) parts = target.substring(1).split('/').filter(p => p !== '');
    }

    for (let p of parts) {
      if (p === '.') continue;
      if (p === '..') {
        if (newPath.length > 1) newPath.pop();
      } else {
        newPath.push(p);
      }
    }
    return newPath;
  }

  const COMMANDS = {
    help: () => `Available commands:\n\n  ls [dir]              — list directory contents\n  cd [dir]              — change directory\n  pwd                   — print working directory\n  cat <file>            — view file contents\n  sudo impress-recruiter — run recruitment protocol\n  whoami                — current user\n  date                  — print system date\n  echo [text]           — display text\n  clear                 — clear terminal\n  help                  — show this message\n\nTip: use ↑↓ arrow keys for command history.`,
    
    ls: (args) => {
      let targetPath = cwd;
      if (args[0]) targetPath = resolvePath(args[0]);
      
      const dir = getDir(targetPath);
      if (!dir) return `ls: cannot access '${args[0]}': No such file or directory`;
      if (dir.type !== 'dir') return args[0]; // ls on a file just prints the file name
      
      let out = [];
      for (let key in dir.contents) {
        if (dir.contents[key].type === 'dir') out.push(`${key}/`);
        else out.push(key);
      }
      return out.length ? out.join('  ') : '';
    },
    
    cd: (args) => {
      const target = args[0] || '~';
      const newPath = resolvePath(target);
      const dir = getDir(newPath);
      
      if (!dir) return `bash: cd: ${target}: No such file or directory`;
      if (dir.type !== 'dir') return `bash: cd: ${target}: Not a directory`;
      
      cwd = newPath;
      
      // Update prompt
      if (pathEl) {
        let displayPath = cwd.join('/').replace(/^~/, '~');
        pathEl.textContent = displayPath;
      }
      return null;
    },
    
    pwd: () => cwd.join('/').replace(/^~/, '/home/visitor'),
    
    cat: (args) => {
      if (!args.length) return `cat: missing file operand`;
      
      const targetPath = resolvePath(args[0]);
      const filename = targetPath.pop();
      const dir = getDir(targetPath);
      
      if (!dir || !dir.contents || !dir.contents[filename]) {
        return `cat: ${args[0]}: No such file or directory`;
      }
      
      const file = dir.contents[filename];
      if (file.type === 'dir') return `cat: ${args[0]}: Is a directory`;
      if (file.denied) return `cat: ${args[0]}: Permission denied`;
      return file.content;
    },
    
    sudo: (args) => {
      if (args[0] === 'impress-recruiter') {
        return `[sudo] password for visitor: ••••••••\nAuthenticating... OK\n\nimpress-recruiter v2.6.1 — initializing...\n\n[✓] Linux skills           VERIFIED\n[✓] Coffee consumption     CRITICAL\n[✓] Open source activity   PRESENT\n[✓] Automation instinct    HIGH\n[✓] Hire-ability score     99.8%\n\nContact: mail@jeetjawale.dev\n→ Offer drafted. Awaiting your signature. █`;
      }
      if (args[0] === 'rm' && args[1] === '-rf' && args[2] === '/') {
        return `sudo: nice try, but I need this server.`;
      }
      return `sudo: ${args[0]}: command not found`;
    },
    whoami: () => `visitor\n\n...Wait, are you a recruiter? Or just someone inspecting Jeet's code?\nEither way, you are currently exploring the portfolio of Jeet Jawale, a Software Engineer and automation enthusiast.`,
    'uname': () => `Linux jeet-pc 7.0.9-204.fc44.x86_64 #1 SMP PREEMPT_DYNAMIC\nFedora Linux 44 x86_64 GNU/Linux`,
    date: () => new Date().toString(),
    echo: (args) => args.join(' '),
    clear: () => null,
  };

  const history = []; let histIdx = -1;

  function addBlock(cmd, result, resultCls = '') {
    const block = document.createElement('div'); block.className = 'cli-out-block';
    
    // Create the command echo with the prompt
    if (cmd !== undefined && cmd !== null) { 
      const cmdEl = document.createElement('div'); 
      cmdEl.className = 'cli-out-cmd'; 
      
      const promptSpan = document.createElement('span');
      promptSpan.className = 'cli-prompt';
      promptSpan.textContent = `visitor@fedora:${cwd.join('/')}$ `;
      
      const textSpan = document.createElement('span');
      textSpan.textContent = cmd;
      
      cmdEl.appendChild(promptSpan);
      cmdEl.appendChild(textSpan);
      block.appendChild(cmdEl); 
    }
    
    // Add result output
    if (result) { 
      const resEl = document.createElement('div'); 
      resEl.className = 'cli-out-text' + (resultCls ? ' ' + resultCls : ''); 
      resEl.textContent = result; 
      block.appendChild(resEl); 
    }
    
    output.appendChild(block); 
    body.scrollTop = body.scrollHeight;
  }

  async function runCommand(raw) {
    const cmdStr = raw.trim(); 
    if (!cmdStr) {
      addBlock(''); // just print empty prompt
      return;
    }
    
    if (history[0] !== cmdStr) history.unshift(cmdStr); if (history.length > 50) history.pop(); histIdx = -1;
    if (cmdStr === 'clear') { output.innerHTML = ''; return; }
    
    const parts = cmdStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    let handler = COMMANDS[cmd];
    if (handler) { 
      input.disabled = true; 
      try { 
        const result = await handler(args); 
        addBlock(cmdStr, result, cmdStr.startsWith('sudo impress') ? 'cli-ok' : ''); 
      } catch (e) { 
        addBlock(cmdStr, `Error: ${e.message}`, 'cli-err'); 
      } 
      input.disabled = false; input.focus(); 
    } else { 
      addBlock(cmdStr, `bash: ${cmd}: command not found\n(try 'help' to see available commands)`, 'cli-err'); 
    }
  }

  // Show welcome
  addBlock(null, `Welcome to visitor@fedora:~/portfolio\nType 'help' to see available commands.\n──────────────────────────────────────────\nbash: work-life-balance: command not found`, 'cli-err');

  input.addEventListener('keydown', (e) => {
    if (window.AudioFX && !['Shift', 'Control', 'Alt', 'Meta', 'Tab'].includes(e.key)) {
      try { window.AudioFX.playKeystroke(); } catch(err) {}
    }
    if (e.key === 'Enter') { const val = input.value; input.value = ''; runCommand(val); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx] || ''; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx > 0) { histIdx--; input.value = history[histIdx] || ''; } else { histIdx = -1; input.value = ''; } }
    else if (e.key === 'Tab') { 
      e.preventDefault(); 
      const partial = input.value.trim(); 
      const matches = Object.keys(COMMANDS).filter(k => k.startsWith(partial)); 
      if (matches.length === 1) {
        input.value = matches[0] + ' '; 
      }
    }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); output.innerHTML = ''; }
    else if (e.key === 'Escape') { overlay.classList.remove('active'); overlay.setAttribute('aria-hidden', 'true'); }
  });

  body.addEventListener('click', () => input.focus());

  // Close button
  if (closeBtn) closeBtn.addEventListener('click', () => { overlay.classList.remove('active'); overlay.setAttribute('aria-hidden', 'true'); });

  // Toggle with backtick key (global listener)
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' && !e.ctrlKey && !e.altKey && !e.metaKey) {
      // Don't trigger if user is typing in some other input
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') && document.activeElement !== input) return;
      e.preventDefault();
      const isActive = overlay.classList.contains('active');
      overlay.classList.toggle('active', !isActive);
      overlay.setAttribute('aria-hidden', String(isActive));
      if (!isActive) { setTimeout(() => input.focus(), 100); }
    }
  });
}

/* ============================================================
   X. Audio System
   ============================================================ */
window.AudioFX = (function() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;

  function init() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playClick() {
    init();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  function playKeystroke() {
    init();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100 + Math.random() * 50, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.03);
  }

  function playSwoosh() {
    init();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  return { playClick, playKeystroke, playSwoosh };
})();

/* ============================================================
   7. Click FX
   ============================================================ */
function initClickFX() {
  document.addEventListener('click', (e) => {
    // Only play sound if user interacted, browser policy requires first interaction
    try { window.AudioFX.playClick(); } catch(err) {}

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 400);
  });
}

/* ============================================================
   8. Live Time Updater
   ============================================================ */
function updateLiveTime() {
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;
  
  function tick() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: true });
  }
  
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   9. Hinton's Conscience
   ============================================================ */
function initHintonWidget() {
  const toggle = document.getElementById('hinton-toggle');
  const panel = document.getElementById('hinton-panel');
  const close = document.getElementById('hinton-close');
  const next = document.getElementById('hinton-next');
  const quoteEl = document.getElementById('hinton-quote');
  
  if (!toggle || !panel) return;

  const quotes = [
    "\"What is consciousness but a very deep network with no ground truth labels?\"",
    "\"The future depends on some graduate student who is deeply suspicious of everything I have said.\"",
    "\"I don't think there's anything you can do with a human brain that you can't do with a neural net.\"",
    "\"To understand the brain, we first have to build it.\"",
    "\"It is very hard to predict the future when you are busy inventing it.\"",
    "\"Perhaps the universe is just a forward pass waiting for the loss function.\""
  ];

  let currentQuote = 0;

  toggle.addEventListener('click', () => {
    panel.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
  });

  close.addEventListener('click', () => {
    panel.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');
  });

  next.addEventListener('click', () => {
    currentQuote = (currentQuote + 1) % quotes.length;
    quoteEl.style.opacity = 0;
    setTimeout(() => {
      quoteEl.textContent = quotes[currentQuote];
      quoteEl.style.opacity = 1;
    }, 200);
  });
  
  quoteEl.style.transition = 'opacity 0.2s';
}

/* ============================================================
   10. Boot Sequence
   ============================================================ */
function initBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  const bootText = document.getElementById('boot-text');
  if (!bootScreen || !bootText) return;

  // Optional: Only run once per session
  if (sessionStorage.getItem('jeetOSBooted')) {
    bootScreen.style.display = 'none';
    return;
  }
  
  const bootLines = [
    "[    0.000000] Linux version 7.0.9-204.fc44.x86_64 (gcc 14.1.1)",
    "[    0.142981] smpboot: CPU0: Neural Compute Engine @ 4.20GHz",
    "[    0.384721] ACPI: Core revision 20260628",
    "[    0.912344] systemd[1]: Starting systemd-udevd...",
    "[    1.245892] [ <span style=\"color:var(--green-b)\">OK</span> ] Reached target Basic System.",
    "[    1.391283] [ <span style=\"color:var(--green-b)\">OK</span> ] Started Network Manager.",
    "[    1.502931] Mounting /home/visitor/portfolio...",
    "[    1.802194] [ <span style=\"color:var(--green-b)\">OK</span> ] Mounted /home/visitor/portfolio.",
    "[    2.102384] Boot sequence complete. Initializing display..."
  ];
  
  let i = 0;
  
  function printLine() {
    if (i < bootLines.length) {
      bootText.innerHTML += bootLines[i] + '<br>';
      i++;
      setTimeout(printLine, Math.random() * 80 + 30);
    } else {
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        sessionStorage.setItem('jeetOSBooted', 'true');
        setTimeout(() => bootScreen.style.display = 'none', 500);
      }, 500);
    }
  }
  
  setTimeout(printLine, 100);
}

/* ============================================================
   11. Text Scramble Effect
   ============================================================ */
function initTextScramble() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(tab => {
    const originalText = tab.dataset.tab; 
    if (!originalText) return;
    
    let interval = null;

    tab.addEventListener('mouseenter', (e) => {
      let iteration = 0;
      clearInterval(interval);
      
      interval = setInterval(() => {
        e.target.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("");
        
        if (iteration >= originalText.length) {
          clearInterval(interval);
          e.target.innerText = originalText;
        }
        
        iteration += 1 / 3;
      }, 30);
    });
  });
}

/* ============================================================
   12. Project Modals
   ============================================================ */
function initProjectModals() {
  const modal = document.getElementById('proj-modal');
  const closeBtn = document.getElementById('pm-close');
  if (!modal) return;

  const titleEl = document.getElementById('pm-title');
  const techEl = document.getElementById('pm-tech');
  const descEl = document.getElementById('pm-desc');
  const probEl = document.getElementById('pm-prob');
  const constraintsEl = document.getElementById('pm-constraints');
  const archEl = document.getElementById('pm-arch');
  const tradeoffsEl = document.getElementById('pm-tradeoffs');
  const learnedEl = document.getElementById('pm-learned');
  const proofEl = document.getElementById('pm-proof');
  const linksEl = document.getElementById('pm-links');
  const archDiagramEl = document.getElementById('pm-arch-diagram');

  function renderList(el, items) {
    if (!el) return;
    el.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      el.appendChild(li);
    });
  }

  const projectData = {
    opteer: {
      title: "Opteer",
      tech: ["Next.js", "FastAPI", "LangGraph", "LangChain", "PostgreSQL", "SQLAlchemy", "TypeScript"],
      overview: "A local-first AI-powered job application intelligence platform that combines application tracking, resume analysis, job matching, and interview preparation within a unified workflow.",
      problem: "Job seekers juggle multiple fragmented tools—spreadsheets for tracking, ChatGPT for resume tailoring, and generic mock interview platforms. There was no unified, privacy-first solution that handled the entire lifecycle locally.",
      constraints: [
        "Keep sensitive resume and job-application data local-first instead of forcing every workflow through a hosted SaaS model.",
        "Support multiple LLM providers without binding the core workflow to one vendor.",
        "Keep the product useful even as job data arrives from inconsistent sources."
      ],
      architecture: "The architecture relies on a local-first deployment model. I built a LangGraph-powered state machine to handle the complex multi-step reasoning required for job-fit evaluation and resume tailoring. The backend is a robust FastAPI service interacting with PostgreSQL via SQLAlchemy, while the frontend is a highly responsive Next.js application. Integrated Firecrawl and Tavily for live extraction, supporting a wide array of LLM backends (OpenAI, Anthropic, Gemini, Groq, Ollama).",
      archDiagram: "[Next.js UI] <────────> [FastAPI Backend]\n                                │\n         ┌──────────────┬───────┴───────┬──────────────┐\n         │              │               │              │\n   [LangGraph]    [PostgreSQL]    [Firecrawl]      [Tavily]",
      tradeoffs: [
        "Local-first improves privacy and ownership, but it makes setup and environment consistency more important.",
        "LangGraph adds structure to AI workflows, but requires clearer state design than simple one-shot prompts.",
        "Multi-provider support reduces lock-in, but increases configuration and testing surface area."
      ],
      learned: [
        "AI features become more reliable when modeled as explicit workflows instead of scattered prompt calls.",
        "The backend contract matters more when the frontend, database, and model providers all evolve independently.",
        "Job-search tooling needs traceability: users should understand why a match or recommendation was produced."
      ],
      proof: "The source is public on GitHub, with the active build linked from the hero and project card.",
      links: [
        { text: "GitHub ↗", url: "https://github.com/jeetjawale/opteer" }
      ]
    },
    heritage: {
      title: "Heritage Explorer",
      tech: ["React", "MapLibre", "Node.js", "Firebase", "Python", "QGIS"],
      overview: "A full-stack GIS platform for interactive exploration of cultural heritage datasets using React and MapLibre, enabling real-time visualization of GeoJSON layers served from a Node.js backend.",
      problem: "Cultural heritage data is often locked in inaccessible formats or clunky legacy GIS software, making it difficult for the public and researchers to interactively explore historical sites on a modern web interface.",
      constraints: [
        "Transform raw geospatial datasets into browser-friendly formats without losing useful location context.",
        "Keep map interaction responsive while rendering location-heavy GeoJSON data.",
        "Balance public exploration with authenticated features and geolocation-based filtering."
      ],
      architecture: "Processed raw heritage location datasets using QGIS and Python scripts to generate optimized GeoJSON. The frontend utilizes React and MapLibre GL JS for highly performant vector tile rendering. Firebase manages secure data delivery, user authentication, and geolocation-based query filtering.",
      archDiagram: "[QGIS/Python] ─────────> (GeoJSON) ─────────> [Firebase]\n                                                    │\n                                            [React/MapLibre]",
      tradeoffs: [
        "GeoJSON kept the data pipeline simple and inspectable, but required care around payload size and map performance.",
        "MapLibre avoided proprietary lock-in, but pushed more responsibility onto the application for map configuration.",
        "Firebase accelerated authentication, but added a managed-service dependency."
      ],
      learned: [
        "GIS projects are mostly data-shaping problems before they become UI problems.",
        "Map performance depends as much on preprocessing as it does on frontend rendering.",
        "A clear data pipeline makes spatial features easier to debug and explain."
      ],
      proof: "The deployed app and source repository are both available, making the project easy to inspect from demo to implementation.",
      links: [
        { text: "Live ↗", url: "https://mh-heritage-explorer.vercel.app" },
        { text: "GitHub ↗", url: "https://github.com/jeetjawale/heritage-explorer" }
      ]
    },
    survey: {
      title: "Course Exit Survey System",
      tech: ["React", "JavaScript", "Firebase", "Chart.js", "XLSX"],
      overview: "A real-time feedback collection system for academic course evaluation with Chart.js visualization and XLSX export.",
      problem: "Academic departments struggled with paper-based or disjointed digital surveys at the end of courses, leading to delayed feedback loops and tedious manual data aggregation.",
      constraints: [
        "Make the survey simple enough for students to complete quickly.",
        "Give administrators real-time visibility without manual spreadsheet cleanup.",
        "Export data in a format that fits existing academic reporting workflows."
      ],
      architecture: "Developed a responsive React single-page application hooked into Firebase Realtime Database. As students submit feedback, the data is instantly aggregated and visualized on administrative dashboards using Chart.js. Built a custom export module utilizing the XLSX library to generate structured spreadsheet reports for academic accreditation requirements.",
      archDiagram: "[React SPA] <─────────> [Firebase Realtime DB]\n      │\n[Chart.js / XLSX] ──> [Admin Dashboards / Reports]",
      tradeoffs: [
        "Firebase reduced backend complexity, but tied real-time behavior to a managed platform.",
        "Chart.js was fast to ship and easy to read, but less flexible than a custom visualization layer.",
        "Excel export matched stakeholder workflows, even though it added formatting and data-shaping work."
      ],
      learned: [
        "Administrative tools succeed when they fit the reporting process users already have.",
        "Real-time dashboards are only useful when the underlying data model is clean.",
        "Small export features can carry high practical value for non-technical users."
      ],
      proof: "The implementation is available on GitHub, including the React and Firebase integration.",
      links: [
        { text: "GitHub ↗", url: "https://github.com/jeetjawale/Course-Exit-Survey" }
      ]
    },
    learnc: {
      title: "C-Learning App",
      tech: ["Flutter", "Dart", "Firebase Auth", "Firebase Realtime Database", "Provider", "SharedPreferences", "URL Launcher"],
      overview: "A private Flutter learning app for C programming, built around structured theory modules, program examples, quizzes, login persistence, and an external compiler flow.",
      problem: "Beginners learning C often switch between notes, example programs, quizzes, and online compilers. The app brought those learning steps into one mobile-first flow so students could read concepts, inspect examples, test understanding, and jump to compilation from the same interface.",
      constraints: [
        "Keep the project private, with no public deployment or GitHub repository.",
        "Structure a large beginner-friendly C curriculum into navigable theory and program sections.",
        "Persist authentication and quiz progress without building a custom backend service."
      ],
      architecture: "The app uses Flutter with Provider for state management. Firebase Authentication handles signup/login, SharedPreferences stores session data for auto-login, and Firebase Realtime Database stores quiz progress per user. The curriculum is organized as static Dart content models for theory topics and program examples, while the drawer navigation connects Learn, Programs, Compiler, About, and Logout flows.",
      archDiagram: "[Flutter UI] <────────> [Provider State] <────────> [Firebase Auth / DB]\n      │\n[Static Dart Models] ──> [External C Compiler]",
      tradeoffs: [
        "Static Dart content made the curriculum fast to ship and easy to browse offline, but content updates require code changes.",
        "Firebase avoided custom backend work, but introduced external platform configuration and auth-token handling.",
        "Opening an online compiler kept compilation simple, but it depended on a third-party browser-based tool instead of an embedded compiler."
      ],
      learned: [
        "Curriculum apps need clear information architecture before visual polish matters.",
        "Auth persistence, quiz state, and navigation flows are where small learning apps become real products.",
        "Flutter is effective for packaging educational content when the data model is simple and the UI has many repeated screens."
      ],
      proof: "Private project. Not deployed and not available on GitHub; details are based on the local `learn_c` Flutter codebase.",
      links: []
    },
    barc: {
      title: "Bhabha Atomic Research Centre (BARC)",
      tech: ["Python", "PyQt", "QGIS", "PyQGIS"],
      overview: "A spatial analysis pipeline and decision-support interface for emergency response planning.",
      problem: "During emergency tabletop exercises, researchers needed a rapid way to configure environmental parameters, run spatial proximity buffering, and view intersections without manually processing raw QGIS layers.",
      constraints: [
        "Must run entirely offline within secure environments.",
        "Must integrate directly with the existing QGIS software stack.",
        "Must be usable by researchers without deep programming knowledge."
      ],
      architecture: "The application uses QGIS as its core spatial engine. I built a custom desktop interface using PyQt5, which interacts directly with QGIS layers via the PyQGIS API. The tool handles layer ingestion, dynamic proximity buffering based on user inputs, and automated demographic overlay calculations.",
      archDiagram: "[QGIS Layers] <──────────> [PyQGIS Engine] <──────────> [PyQt UI]\n                                  │\n                          [Spatial Outputs]",
      tradeoffs: [
        "Building a PyQt plugin for QGIS avoided standalone GIS engine costs, but tied the solution strictly to the QGIS runtime environment.",
        "Local execution ensures extreme data security, but makes collaborative tabletop planning slightly more rigid."
      ],
      learned: [
        "Geospatial analysis fundamentally alters how quickly a team can model emergency scenarios.",
        "Automating data ingestion with Python scripts reduced manual preprocessing time by approximately 50%, proving that removing friction is as important as building features."
      ],
      proof: "As this was developed for the Radiation Safety Systems Division at BARC Trombay, the source code and operational details are strictly confidential and not publicly available.",
      links: []
    }
  };

  const cards = document.querySelectorAll('.proj-card, .btn-case-study');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pId = card.dataset.project;
      if (!pId || !projectData[pId]) return;

      const data = projectData[pId];

      titleEl.textContent = data.title;
      descEl.textContent = data.overview;
      probEl.textContent = data.problem;
      renderList(constraintsEl, data.constraints);
      archEl.textContent = data.architecture;
      
      if (data.archDiagram) {
        archDiagramEl.style.display = 'block';
        archDiagramEl.textContent = data.archDiagram;
      } else {
        archDiagramEl.style.display = 'none';
      }

      renderList(tradeoffsEl, data.tradeoffs);
      renderList(learnedEl, data.learned);
      proofEl.textContent = data.proof;

      techEl.innerHTML = data.tech.map(t => `<span class="stag">${t}</span>`).join('');

      linksEl.innerHTML = data.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="plink">${l.text}</a>`).join('');

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      try { window.AudioFX.playSwoosh(); } catch(err) {}
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(); // Click outside to close
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* ============================================================
   13. Initialization
   ============================================================ */
(function init() {
  const footerYearEl = document.getElementById('footer-year');
  if (footerYearEl) footerYearEl.textContent = new Date().getFullYear();

  initBootSequence();
  initNeuralCanvas();
  initCoffeeBar();
  initTabs();
  initTextScramble();
  populateBlog();
  initCliEasterEgg();
  initClickFX();
  updateLiveTime();
  initHintonWidget();
  initProjectModals();
})();
