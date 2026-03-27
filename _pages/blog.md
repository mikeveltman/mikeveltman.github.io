---
layout: default
title: Blog
permalink: /blog
---

<div class="page-wrap">
  <h1>Blog</h1>

  {% if site.posts.size > 0 %}
  <ul class="post-list" style="margin-top: 2rem;">
    {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%-d %b %Y" }}</time>
    </li>
    {% endfor %}
  </ul>
  {% else %}
  <p style="color: var(--muted, #8B7355); margin-top: 2rem;">Nothing written yet, but that'll change.</p>
  {% endif %}
</div>
