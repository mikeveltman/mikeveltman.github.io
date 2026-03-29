---
layout: default
title: Home
permalink: /
# hero_image: /assets/photos/czech-republic/62A66506-A200-4235-8530-C810AEA94F81_1_105_c.jpeg
---

<section class="hero{% if page.hero_image %} hero--split{% endif %}">
  <div class="hero__text">
    <p class="hero-sub">
      I should add a line or two about myself here, but for who?
    </p>
    <div class="hero-links">
      <a href="/about" class="btn-outline btn">About me</a>
    </div>
  </div>
  {% if page.hero_image %}
  <div class="hero__photo">
    <img src="{{ page.hero_image }}" alt="">
  </div>
  {% endif %}
</section>

{% if site.posts.size > 0 %}
<section class="section">
  <p class="section__label">Latest posts</p>
  <ul class="post-list">
    {% for post in site.posts limit:3 %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%-d %b %Y" }}</time>
    </li>
    {% endfor %}
  </ul>
  {% if site.posts.size > 3 %}
  <a href="/blog" class="see-all">All posts →</a>
  {% endif %}
</section>
{% endif %}

{% if site.projects.size > 0 %}
<section class="section">
  <p class="section__label">Projects</p>
  <div class="project-grid">
    {% for project in site.projects limit:3 %}
    <a href="{{ project.url }}" class="project-card">
      {% if project.cover %}
      <img class="card-cover" src="{{ project.cover }}" alt="{{ project.title }}">
      {% else %}
      <div class="card-cover"></div>
      {% endif %}
      <div class="card-overlay">
        {% if project.category %}<span class="card-category">{{ project.category }}</span>{% endif %}
        <h3>{{ project.title }}</h3>
      </div>
    </a>
    {% endfor %}
  </div>
  {% if site.projects.size > 3 %}
  <a href="/projects" class="see-all">All projects →</a>
  {% endif %}
</section>
{% endif %}
