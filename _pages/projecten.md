---
layout: default
title: Projects
permalink: /projects
---

<div class="page-wrap">
  <h1>Projects</h1>

  {% if site.projects.size > 0 %}
  <div class="project-grid" style="margin-top: 2rem;">
    {% for project in site.projects %}
    <a href="{{ project.url }}" class="project-card">
      {% if project.cover %}
      <img class="card-cover" src="{{ project.cover }}" alt="{{ project.title }}">
      {% else %}
      <div class="card-cover"></div>
      {% endif %}
      <div class="card-body">
        <h3>{{ project.title }}</h3>
        {% if project.description %}<p>{{ project.description }}</p>{% endif %}
      </div>
    </a>
    {% endfor %}
  </div>
  {% else %}
  <p style="color: var(--muted, #8B7355); margin-top: 2rem;">Projects coming soon.</p>
  {% endif %}
</div>
