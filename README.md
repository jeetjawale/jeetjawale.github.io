# Jeet Jawale - Portfolio Website

A modern, minimalist portfolio website showcasing my work as a software engineer specializing in backend systems, distributed architecture, and full-stack development.

## Overview

This is a personal portfolio website built with vanilla HTML, CSS, and JavaScript. It serves as a central hub to display my professional profile, projects, and expertise to potential collaborators and employers.

## Features

- **Responsive Design** - Optimized for desktop and mobile devices
- **Light/Dark Mode** - Automatic theme switching based on system preferences
- **Monospace Typography** - Using Fira Code font for a technical aesthetic
- **Smooth Navigation** - Seamless scrolling and page interactions
- **SEO Optimized** - Proper meta tags for social sharing and search engines
- **Fast Loading** - No heavy frameworks or dependencies

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- Vanilla JavaScript
- Google Fonts (Fira Code)

## Getting Started

Simply clone the repository and open `index.html` in your browser:

```bash
git clone https://github.com/jeetjawale/jeetjawale.github.io.git
cd jeetjawale.github.io
open index.html
```

Or visit the live site: [jeetjawale.github.io](https://jeetjawale.github.io)

## Directory Structure

```
.
├── index.html          # Main portfolio page
├── 404.html           # Custom error page
├── blog/              # Blog section
│   ├── posts.js       # Blog posts data (UPDATE THIS to add new posts)
│   ├── blog.html      # Blog listing page
│   ├── 001-*.html     # Individual blog posts
│   ├── 002-*.html
│   └── 003-*.html
├── README.md          # This file
└── .git/             # Git repository metadata
```

## How to Add a New Blog Post

The blog system automatically updates both the main portfolio page and the blog listing page. To add a new post:

### 1. Create the blog post HTML file

Create a new file in the `blog/` directory following the naming pattern: `00X-your-post-slug.html`

Copy an existing post file as a template and update:
- Title, meta tags, and OpenGraph metadata
- Article content
- Related posts section

### 2. Update the posts.js file

Edit `blog/posts.js` and add your new post to the `blogPosts` array:

```javascript
{
  id: "004-your-post-slug",           // Must match filename (without .html)
  title: "Your Post Title",
  date: "Mar 1, 2026",
  excerpt: "Brief description of your post...",
  readTime: "8 min read",
  category: "Your Category",          // Used for filtering
  wordCount: 2500,
  latest: true                        // Set to true for newest post
}
```

### 3. Update filter buttons (optional)

If you're adding a new category, update the filter buttons in `blog/blog.html`:

```html
<button class="filter-btn" data-filter="Your Category">Your Category</button>
```

That's it! Both the homepage and blog listing page will automatically show your new post.

## Customization

To customize the website:

1. Edit the meta tags in `<head>` to update site title, description, and social media information
2. Modify CSS variables in the `:root` section to change colors and theming
3. Update HTML content sections to add your own information

## License

This project is open source. Feel free to fork and use as a template for your own portfolio.

## Contact

For inquiries or opportunities, please reach out through the contact information provided on the website.
