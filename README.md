# mikeveltman.nl

Personal website built with [Jekyll](https://jekyllrb.com), hosted on GitHub Pages at [mikeveltman.nl](https://mikeveltman.nl).

## Running locally

```bash
bundle exec jekyll serve --livereload
```

Open [http://localhost:4000](http://localhost:4000). The site reloads automatically when you save a file.

> **First time?** You need Ruby 3.2.1 and bundler. See setup below.

### First-time setup

```bash
brew install rbenv ruby-build
echo 'eval "$(rbenv init - zsh)"' >> ~/.zshrc && source ~/.zshrc
rbenv install 3.2.1
gem install bundler:2.7.1
bundle install
```

## Writing a blog post

Create a file in `_posts/` with the format `YYYY-MM-DD-title.md`:

```
_posts/2026-04-01-my-first-post.md
```

Minimal front matter:

```yaml
---
title: My first post
date: 2026-04-01
---

Write your post here in Markdown.
```

The post will automatically appear in the blog listing and on the homepage.

## Adding a project

Create a file in `_projects/`:

```
_projects/my-project.md
```

```yaml
---
title: My project
date: 2026-04-01
description: Short line shown in the project grid.
cover: /assets/images/cover.jpg   # optional
---

Describe the project here.

<!-- Photo grid -->
<div class="photo-grid">
  <img src="/assets/images/photo1.jpg" alt="">
  <img src="/assets/images/photo2.jpg" alt="">
</div>

<!-- Spotify embed: Spotify → Share → Embed → copy iframe -->
<div class="spotify-embed">
  <iframe src="https://open.spotify.com/embed/..." ...></iframe>
</div>
```

## Adding photos

Put images in `assets/images/` and reference them with `/assets/images/filename.jpg`.

## Structure

```
_layouts/       HTML templates (default, page, post, project)
_includes/      Reusable snippets (header, footer, icons)
_pages/         Static pages (index, about, blog, projects)
_posts/         Blog posts (YYYY-MM-DD-title.md)
_projects/      Project pages
_sass/          Stylesheet (edit _style.scss)
assets/         Images and other static files
```

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds and deploys the site automatically.
