import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract CSS
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    style_content = style_match.group(1).strip()
    html = html.replace(style_match.group(0), '<link rel="stylesheet" href="assets/css/style.css">')

# Extract JS
# Find the script block after posts.js
match = re.search(r'<script src="blog/posts\.js"></script>\s*<script>(.*?)</script>', html, re.DOTALL)
if match:
    script_content = match.group(1).strip()
    html = html.replace('<script>' + match.group(1) + '</script>', '<script src="assets/js/main.js"></script>')

# Replace the font-awesome link with a newer version
html = html.replace('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css')

# Inject theme dropdown
theme_toggle_original = r"""<button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle theme">
      <span id="theme-icon">☾</span>
    </button>"""
theme_dropdown = r"""<div class="theme-dropdown-container">
      <button class="theme-toggle" id="theme-toggle" aria-label="Change theme" title="Change theme">
        <span id="theme-icon">☾</span>
      </button>
      <div id="theme-menu" class="theme-menu">
         <button data-theme="light" class="theme-option"><i class="fa-solid fa-circle" style="color:#ffffff; border: 1px solid #ccc; border-radius:50%"></i> Light</button>
         <button data-theme="dark" class="theme-option"><i class="fa-solid fa-circle" style="color:#333333"></i> Dark</button>
         <button data-theme="gruvbox" class="theme-option"><i class="fa-solid fa-circle" style="color:#d79921"></i> Gruvbox</button>
         <button data-theme="solarized" class="theme-option"><i class="fa-solid fa-circle" style="color:#2aa198"></i> Solarized</button>
         <button data-theme="dracula" class="theme-option"><i class="fa-solid fa-circle" style="color:#bd93f9"></i> Dracula</button>
         <button data-theme="monokai" class="theme-option"><i class="fa-solid fa-circle" style="color:#a6e22e"></i> Monokai</button>
         <button data-theme="catppuccin" class="theme-option"><i class="fa-solid fa-circle" style="color:#cba6f7"></i> Catppuccin</button>
      </div>
    </div>"""
html = html.replace(theme_toggle_original, theme_dropdown)

# Add themes to CSS
themes_css = r"""
[data-theme="gruvbox"] {
  --bg: #282828; --bg2: #3c3836; --border: #504945; --border2: #665c54; --text: #ebdbb2; --muted: #a89984; --mid: #bdae93; --accent: #ebdbb2; --surface: #32302f; --ink: #d79921; --ink-muted: #b8bb26; --nav-bg: rgba(40,40,40,.96); --cursor-ring: rgba(215,153,33,.35);
}
[data-theme="solarized"] {
  --bg: #002b36; --bg2: #073642; --border: #586e75; --border2: #657b83; --text: #839496; --muted: #586e75; --mid: #657b83; --accent: #93a1a1; --surface: #002b36; --ink: #2aa198; --ink-muted: #859900; --nav-bg: rgba(0,43,54,.96); --cursor-ring: rgba(42,161,152,.35);
}
[data-theme="dracula"] {
  --bg: #282a36; --bg2: #44475a; --border: #6272a4; --border2: #44475a; --text: #f8f8f2; --muted: #6272a4; --mid: #f8f8f2; --accent: #f8f8f2; --surface: #282a36; --ink: #bd93f9; --ink-muted: #ff79c6; --nav-bg: rgba(40,42,54,.96); --cursor-ring: rgba(189,147,249,.35);
}
[data-theme="monokai"] {
  --bg: #272822; --bg2: #3e3d32; --border: #75715e; --border2: #49483e; --text: #f8f8f2; --muted: #75715e; --mid: #f8f8f2; --accent: #f8f8f2; --surface: #272822; --ink: #a6e22e; --ink-muted: #f92672; --nav-bg: rgba(39,40,34,.96); --cursor-ring: rgba(166,226,46,.35);
}
[data-theme="catppuccin"] {
  --bg: #1e1e2e; --bg2: #313244; --border: #45475a; --border2: #585b70; --text: #cdd6f4; --muted: #a6adc8; --mid: #bac2de; --accent: #cdd6f4; --surface: #181825; --ink: #cba6f7; --ink-muted: #f38ba8; --nav-bg: rgba(30,30,46,.96); --cursor-ring: rgba(203,166,247,.35);
}

.theme-dropdown-container { position: relative; }
.theme-menu {
  position: absolute; top: 100%; right: 0; margin-top: 0.5rem;
  background: var(--bg); border: 1px solid var(--border);
  padding: 0.5rem; min-width: 160px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex; flex-direction: column; gap: 0.25rem;
  opacity: 0; visibility: hidden; transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 8px;
}
.theme-menu.open { opacity: 1; visibility: visible; transform: translateY(0); }
.theme-option {
  background: transparent; border: none; color: var(--muted);
  padding: 0.6rem 0.75rem; text-align: left; cursor: pointer;
  font-size: 0.9rem; display: flex; align-items: center; gap: 0.75rem;
  border-radius: 4px; font-family: inherit;
}
.theme-option:hover { background: var(--bg2); color: var(--text); }
.theme-option.active { color: var(--ink); background: var(--bg2); }
"""

style_content = style_content.replace('}\n\nbody { transition:', '}\n' + themes_css + '\nbody { transition:')

# Add new JS for themes and replace old theme code
theme_js = r"""
/* ── THEME SWITCHER ── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeIcons = {
  'light': '☀',
  'dark': '☾',
  'gruvbox': '☾',
  'solarized': '☾',
  'dracula': '☾',
  'monokai': '☾',
  'catppuccin': '☾'
};

const themeColors = {
  'light': '000000',
  'dark': 'ffffff',
  'gruvbox': 'd79921',
  'solarized': '2aa198',
  'dracula': 'bd93f9',
  'monokai': 'a6e22e',
  'catppuccin': 'cba6f7'
};

function updateGraphColor(theme) {
  const ghGraph = document.querySelector('.github-graph-container img');
  if(ghGraph) {
    const color = themeColors[theme] || '2188ff';
    ghGraph.src = `https://ghchart.rshah.org/${color}/jeetjawale`;
    // remove the invert filter if it exists in the new themes, or let CSS handle it.
    // CSS has `filter: invert(1)` for dark mode, but we might want colored graphs.
    // We will just let ghchart handle the color.
  }
}

function setActiveOption(theme) {
  themeOptions.forEach(opt => {
    opt.classList.remove('active');
    if(opt.dataset.theme === theme) opt.classList.add('active');
  });
  if(themeIcon) themeIcon.textContent = themeIcons[theme] || '☾';
}

setActiveOption(savedTheme);
updateGraphColor(savedTheme);

themeToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  themeMenu.classList.toggle('open');
});

document.addEventListener('click', () => {
  themeMenu?.classList.remove('open');
});

themeOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const selectedTheme = opt.dataset.theme;
    document.documentElement.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
    setActiveOption(selectedTheme);
    updateGraphColor(selectedTheme);
    themeMenu.classList.remove('open');
  });
});
"""

# Replace old dark mode logic in JS
old_dark_mode = r"""/* ── DARK MODE ── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀' : '☾';

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeIcon.textContent = next === 'dark' ? '☀' : '☾';
});"""

if old_dark_mode in script_content:
    script_content = script_content.replace(old_dark_mode, theme_js)
else:
    # If exact string didn't match due to formatting, just append
    script_content += "\n" + theme_js

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.write(style_content)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(script_content)

print("Refactor complete.")
