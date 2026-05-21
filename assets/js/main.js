/* ── POPULATE BLOG LIST ── */
(function() {
  const blogList = document.getElementById('blog-list');
  if (blogList && typeof blogPosts !== 'undefined') {
    // Take only the first 3 posts and add the "View all" link
    const displayPosts = blogPosts.slice(0, 3);
    
    displayPosts.forEach(post => {
      const blogItem = document.createElement('a');
      blogItem.href = `blog/${post.id}.html`;
      blogItem.className = 'blog-item';
      blogItem.innerHTML = `
        <div>
          <div class="blog-cat">${post.category}</div>
          <div class="blog-title">${post.title}</div>
          <div class="blog-meta">${post.date} · ${post.readTime}</div>
        </div>
        <div class="blog-arr">↗</div>
      `;
      blogList.appendChild(blogItem);
    });

    // Add "View all" link - distinct styling
    const viewAllItem = document.createElement('a');
    viewAllItem.href = 'blog/blog.html';
    viewAllItem.className = 'blog-item blog-view-all';
    viewAllItem.innerHTML = `
      <div>
        <div class="blog-cat"><i class="fa-solid fa-pen-nib"></i> More writing</div>
        <div class="blog-title">View all blog posts</div>
      </div>
      <div class="blog-arr">↗</div>
    `;
    blogList.appendChild(viewAllItem);
  }
})();



/* ── SPLASH ── */
const splashEl = document.getElementById('splash');
const spPct = document.getElementById('sp-pct');

function skipSplash() {
  if (splashEl) splashEl.classList.add('out');
}

if (splashEl) {
  splashEl.addEventListener('click', skipSplash);
}

if (spPct) {
  let n = 0;
  const pti = setInterval(() => {
    n = Math.min(n + Math.floor(Math.random() * 15) + 5, 100);
    spPct.textContent = String(n).padStart(3,'0') + '%';
    if (n >= 100) clearInterval(pti);
  }, 15);
}
setTimeout(skipSplash, 1200);

/* ── SCROLL PROGRESS ── */
const pFill = document.getElementById('progress-fill');
window.addEventListener('scroll', () => {
  pFill.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
}, { passive: true });

/* ── NAV ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── HANDLE PAGE LOAD WITH HASH & BROWSER NAVIGATION ── */
function scrollToHash() {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      setTimeout(() => {
        const paddingTop = parseInt(getComputedStyle(target).paddingTop) || 0;
        const offsetTop = target.getBoundingClientRect().top + window.scrollY + paddingTop - 64 - 20;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }, 4000);
    }
  }
}

// Scroll to hash on page load (after splash)
window.addEventListener('load', scrollToHash);

// Handle browser back/forward buttons
window.addEventListener('hashchange', scrollToHash);


/* ── INTERSECTION OBSERVER FACTORY ── */
function observe(selector, delay = 0, cb) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cb(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(selector).forEach(el => obs.observe(el));
}

// Section labels
observe('.sec-label', 0, el => el.classList.add('in'));

// Generic fade up
observe('.fu', 0, el => el.classList.add('in'));

// Facts stagger
observe('.about-facts', 0, el => {
  el.querySelectorAll('.fact').forEach((f, i) => setTimeout(() => f.classList.add('in'), i * 70));
});

// Experience stagger
observe('.experience-list', 0, el => {
  el.querySelectorAll('.exp-item').forEach((e, i) => setTimeout(() => e.classList.add('in'), i * 100));
});

// Projects stagger
observe('.projects-list', 0, el => {
  el.querySelectorAll('.proj-item').forEach((p, i) => setTimeout(() => p.classList.add('in'), i * 110));
});

// Skill rows stagger
observe('.skills-table', 0, el => {
  el.querySelectorAll('.skill-row').forEach((r, i) => setTimeout(() => r.classList.add('in'), i * 80));
});

// Blog stagger
observe('.blog-list', 0, el => {
  el.querySelectorAll('.blog-item').forEach((b, i) => setTimeout(() => b.classList.add('in'), i * 75));
});

// Wipe blocks
observe('.wipe-wrap', 0, el => el.classList.add('in'));

/* ── COUNT-UP STATS ── */
(function() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = +el.dataset.target;
        const sup = el.querySelector('sup');
        let cur = 0;
        const step = Math.ceil(target / 28);
        const t = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur;
          if (sup) el.appendChild(sup);
          if (cur >= target) clearInterval(t);
        }, 45);
      });
      io.unobserve(e.target);
    });
  }, { threshold: 0.3 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) io.observe(statsEl);
})();


/* ── THEME SWITCHER ── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeMenu = document.getElementById('theme-menu');
const themeOptions = document.querySelectorAll('.theme-option');

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

const themeIcons = {
  'light': '<i class="fa-solid fa-sun" style="color: #444;"></i>',
  'dark': '<i class="fa-solid fa-moon"></i>',
  'gruvbox': '<i class="fa-solid fa-mug-hot" style="color: #d79921;"></i>',
  'solarized': '<i class="fa-solid fa-sun" style="color: #2aa198;"></i>',
  'dracula': '<i class="fa-solid fa-ghost" style="color: #bd93f9;"></i>',
  'monokai': '<i class="fa-solid fa-leaf" style="color: #a6e22e;"></i>',
  'catppuccin': '<i class="fa-solid fa-cat" style="color: #cba6f7;"></i>'
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

function setActiveOption(theme) {
  themeOptions.forEach(opt => {
    opt.classList.remove('active');
    if(opt.dataset.theme === theme) opt.classList.add('active');
  });
  if(themeIcon) themeIcon.innerHTML = themeIcons[theme] || '<i class="fa-solid fa-palette"></i>';
}

setActiveOption(savedTheme);

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
    themeMenu.classList.remove('open');
  });
});


/* ── MOBILE MENU ── */
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu-link');

navToggle?.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ── ACTIVE NAV HIGHLIGHTING & URL HASH UPDATE ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
let currentSection = '';

function highlightNav() {
  const scrollY = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      // Update active nav link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
      
      // Update URL hash without triggering scroll
      if (currentSection !== sectionId) {
        currentSection = sectionId;
        history.replaceState(null, null, `#${sectionId}`);
      }
    }
  });
  
  // Clear hash when at top of page
  if (scrollY < 200 && currentSection !== '') {
    currentSection = '';
    history.replaceState(null, null, window.location.pathname);
    navLinks.forEach(link => link.classList.remove('active'));
  }
}

window.addEventListener('scroll', highlightNav, { passive: true });

/* ── SMOOTH SCROLL WITH OFFSET ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const paddingTop = parseInt(getComputedStyle(target).paddingTop) || 0;
      const offsetTop = target.getBoundingClientRect().top + window.scrollY + paddingTop - 64 - 20;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      // Update URL hash after clicking link
      const sectionId = target.getAttribute('id');
      if (sectionId) {
        history.pushState(null, null, `#${sectionId}`);
        currentSection = sectionId;
      }
    }
  });
});

/* ── BACK TO TOP ── */
const backToTop = document.getElementById('back-to-top');
const heroScrollHint = document.querySelector('.hero-scroll-hint');
let scrolledOnce = false;
window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('visible', window.scrollY > 500);
  if (!scrolledOnce && window.scrollY > 100) {
    scrolledOnce = true;
    heroScrollHint?.style.setProperty('opacity', '0');
    heroScrollHint?.style.setProperty('transition', 'opacity .5s ease');
  }
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── EMAIL VALIDATION & SPAM PREVENTION ── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const commonSpamDomains = ['spam', 'test', 'fake', 'invalid'];
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 3000; // 3 seconds between submissions

function isValidEmail(email) {
  // Check basic email format
  if (!emailRegex.test(email)) return false;
  
  // Check email length (prevent excessively long emails)
  if (email.length > 254) return false;
  
  // Check for suspicious patterns
  if (email.includes('..')) return false;
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  // Check for common spam domain patterns
  const domain = email.split('@')[1].toLowerCase();
  if (commonSpamDomains.some(spam => domain.includes(spam))) return false;
  
  return true;
}

function isValidMessage(message) {
  // Check message length (reasonable bounds)
  return message.length > 5 && message.length < 5000;
}

function isValidName(name) {
  // Check name length and format
  return name.length > 2 && name.length < 100 && /^[a-zA-Z\s'-]+$/.test(name);
}

/* ── SUBMIT ── */
const contactForm = document.getElementById('contact-form');
const subBtn = document.getElementById('sub-btn');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = contactForm.querySelector('#f-name').value.trim();
    const email = contactForm.querySelector('#f-email').value.trim();
    const message = contactForm.querySelector('#f-message').value.trim();
    
    // Check for empty fields
    if (!name || !email || !message) {
      subBtn.textContent = 'Please fill all fields';
      subBtn.classList.add('error');
      setTimeout(() => {
        subBtn.textContent = 'Send Message';
        subBtn.classList.remove('error');
      }, 2000);
      return;
    }
    
    // Rate limiting - prevent spam submissions
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      subBtn.textContent = 'Please wait before sending again';
      subBtn.classList.add('error');
      setTimeout(() => {
        subBtn.textContent = 'Send Message';
        subBtn.classList.remove('error');
      }, 2000);
      return;
    }
    
    // Validate name
    if (!isValidName(name)) {
      subBtn.textContent = 'Invalid name format';
      subBtn.classList.add('error');
      setTimeout(() => {
        subBtn.textContent = 'Send Message';
        subBtn.classList.remove('error');
      }, 2000);
      return;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
      subBtn.textContent = 'Invalid email address';
      subBtn.classList.add('error');
      setTimeout(() => {
        subBtn.textContent = 'Send Message';
        subBtn.classList.remove('error');
      }, 2000);
      return;
    }
    
    // Validate message
    if (!isValidMessage(message)) {
      subBtn.textContent = 'Message must be between 5-5000 characters';
      subBtn.classList.add('error');
      setTimeout(() => {
        subBtn.textContent = 'Send Message';
        subBtn.classList.remove('error');
      }, 2000);
      return;
    }
    
    lastSubmitTime = now;
    const orig = subBtn.textContent;
    subBtn.textContent = 'Sending...';
    subBtn.disabled = true;
    
    // Submit to Formspree
    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        subBtn.textContent = 'Sent ✓';
        subBtn.classList.add('success');
        subBtn.disabled = false;
        
        setTimeout(() => {
          subBtn.textContent = orig;
          subBtn.classList.remove('success');
          contactForm.reset();
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      subBtn.textContent = 'Failed. Try again?';
      subBtn.classList.add('error');
      subBtn.disabled = false;
      lastSubmitTime = 0; // Allow retry on error
      
      setTimeout(() => {
        subBtn.textContent = orig;
        subBtn.classList.remove('error');
      }, 3000);
    });
  });
}

/* ── MAGNETIC BUTTONS ── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.3;
      const dy = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── GITHUB TABS & DATA ── */
(function() {
  const prList = document.getElementById('github-prs-list');
  const prExpand = document.getElementById('github-prs-expand');
  const prSubtitle = document.querySelector('.prs-subtitle');
  const user = 'jeetjawale';
  let currentPRs = [];
  let currentVisibleCount = 3;

  // Total contributions fetch
  async function fetchTotalContributions() {
    const totalEl = document.getElementById('github-total-contributions');
    if (!totalEl) return;
    try {
      const response = await fetch(`https://github-contributions-api.deno.dev/${user}.json`);
      const data = await response.json();
      
      let total = 0;
      if (data.totalContributions !== undefined) {
        total = data.totalContributions;
      } else if (data.contributions && Array.isArray(data.contributions)) {
        // Handle 2D array (weeks -> days) if totalContributions is missing
        total = data.contributions.flat().reduce((sum, day) => sum + (day.contributionCount || 0), 0);
      } else if (data.total) {
        total = Object.values(data.total).reduce((sum, val) => sum + (Number(val) || 0), 0);
      }
      
      totalEl.textContent = `${total.toLocaleString()} total contributions`;
    } catch (e) {
      console.error('Error fetching total contributions:', e);
      totalEl.textContent = 'View contributions on GitHub';
    }
  }

  const queries = {
    merged: `author:${user} is:pr is:public is:merged`,
    open: `author:${user} is:pr is:public is:open`,
    closed: `author:${user} is:pr is:public is:closed -is:merged`
  };

  const titles = {
    merged: 'Merged contributions to open source',
    open: 'Open contributions and bug reports',
    closed: 'Closed contributions (not merged)'
  };

  function renderPRs(state, items, limit) {
    if (!prList) return;
    prList.innerHTML = '';
    
    const toShow = items.slice(0, limit);
    toShow.forEach(item => {
      const repoPath = item.repository_url.split('/repos/')[1];
      const prItem = document.createElement('div');
      prItem.className = 'pr-item';
      prItem.innerHTML = `
        <div class="pr-dot" style="background: ${state === 'merged' ? '#bf40bf' : (state === 'open' ? '#238636' : '#da3633')}"></div>
        <div class="pr-info">
          <a href="${item.html_url}" target="_blank" rel="noopener noreferrer" class="pr-title">${item.title}</a>
          <span class="pr-repo">${repoPath}</span>
        </div>
      `;
      prList.appendChild(prItem);
    });

    const moreCount = items.length - limit;
    if (items.length > 3) {
      prExpand.style.display = 'flex';
      if (moreCount > 0) {
        prExpand.innerHTML = `<i class="fa-solid fa-arrow-down-long"></i> Expand all`;
        prExpand.dataset.action = 'expand';
      } else {
        prExpand.innerHTML = `<i class="fa-solid fa-arrow-up-long"></i> Collapse`;
        prExpand.dataset.action = 'collapse';
      }
    } else {
      prExpand.style.display = 'none';
    }
  }

  async function fetchPRs(state) {
    if (!prList) return;
    
    prList.innerHTML = '<div class="pr-loading">Fetching real-time activity...</div>';
    prExpand.style.display = 'none';
    prSubtitle.textContent = titles[state];
    currentVisibleCount = 3;

    try {
      const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(queries[state])}&per_page=20`);
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        prList.innerHTML = `<div class="pr-loading">No ${state} contributions found.</div>`;
        return;
      }

      currentPRs = data.items;
      renderPRs(state, currentPRs, currentVisibleCount);

      prExpand.onclick = () => {
        if (prExpand.dataset.action === 'expand') {
          currentVisibleCount = currentPRs.length;
        } else {
          currentVisibleCount = 3;
          document.querySelector('.prs-header').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        renderPRs(state, currentPRs, currentVisibleCount);
      };

    } catch (error) {
      console.error('GitHub API error:', error);
      prList.innerHTML = '<div class="pr-loading">Error loading data. Check your connection.</div>';
    }
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      fetchPRs(btn.dataset.state);
    });
  });

  // Initial load
  fetchTotalContributions();
  fetchPRs('merged');
})();