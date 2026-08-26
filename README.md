# Start Investing Simple

Plain-English guides to investing, saving, and personal finance for beginners — built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), and React (for interactive tools).

Live at: **startinvestingsimple.com**

## Project structure

```text
/
├── public/                     # Static assets (favicon, robots.txt)
├── src/
│   ├── components/              # Header, Footer, and React tools (calculators)
│   ├── content/
│   │   └── blog/                # Blog articles (Markdown)
│   ├── content.config.ts        # Blog collection schema
│   ├── layouts/                 # Layout.astro (base) and BlogPost.astro (articles)
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── privacy-policy.astro
│   │   ├── disclaimer.astro
│   │   ├── terms.astro
│   │   ├── blog/
│   │   │   ├── index.astro      # Article listing
│   │   │   └── [...slug].astro  # Individual article pages
│   │   └── tools/
│   │       ├── index.astro
│   │       └── compound-interest-calculator.astro
│   └── styles/global.css
└── astro.config.mjs
```

## Adding a new article

Create a new Markdown file in `src/content/blog/` with this frontmatter:

```md
---
title: "Article Title"
description: "One or two sentence summary for SEO and article listings."
pubDate: 2026-03-01
author: "Start Investing Simple Team"
category: "Investing Basics" # or "Saving & Budgeting", "Retirement Planning", etc.
tags: ["tag1", "tag2"]
draft: false
---

Article content in Markdown goes here.
```

The article will automatically appear on `/blog/` and be published at `/blog/<filename>/`.

## Before going live / applying to AdSense

- [ ] Replace placeholder contact email (`hello@startinvestingsimple.com`) in `contact.astro`, `privacy-policy.astro`, `disclaimer.astro`, and `terms.astro`
- [ ] Fill in real author name/bio in `about.astro`
- [ ] Publish at least 20–30 original, in-depth articles (800–1,200+ words each)
- [ ] Add a real Open Graph image at `public/og-default.png`
- [ ] Set up Google Search Console and submit the sitemap (`/sitemap-index.xml`)
- [ ] Deploy to your host and connect the `startinvestingsimple.com` domain

## Commands

| Command | Action |
| :--- | :--- |
| `npm install` | Install dependencies |
| `npm run dev` | Start local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview the production build locally |
