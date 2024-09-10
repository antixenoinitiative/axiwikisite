---
title: Home
description: Welcome to the Anti-Xeno Initiative Wiki. Your complete repository for Anti-Xeno Combat.
published: true
date: 2021-09-19T07:56:05.682Z
tags: admin
editor: markdown
dateCreated: 2021-06-08T12:40:49.911Z
layout: home
---

<div style="display: flex; gap: 0.5em">
    <div>
        <h1>Anti-Xeno Initiative Wiki</h1>
        <p>Welcome to the Anti-Xeno Initiative Wiki. The primary repository for the Anti-Xeno Initiative, here you will find tutorials, guides and detailed breakdowns of Thargoid Combat and Thargoids in Elite: Dangerous.</p>
        <p>The Anti-Xeno Wiki is a collection of articles and guides written by the experience Pilots and Mentors of the Anti-Xeno Initiative Community, you can join the community for any further questions or assistance from the many talented and friendly commanders.</p>
    </div>
    <img src="{{ site.baseurl }}/assets/images/icons/AXI_Logo_New.webp" alt="AXI Logo" style="object-fit: contain;">
</div>


Want to contribute? if you know a thing or two about AX combat you can help edit the wiki. Log in with your Discord account and contact a staff of the AXI discord server to get the editor role.

## Popular Topics

🚀 Ship Builds

[Recommended Builds](/builds){: .btn } [Ship Build Theory](/shipbuildtheory){: .btn } [Build Repository](/buildrepository){: .btn }

⭐ Combat Guides

[Basic Combat Guide](/basic-combat-guide){: .btn } [Advanced Combat Guide](/advanced-combat-guide){: .btn } [Speedrunning Guide](/combat-speedrunning){: .btn }

🛸 Thargoids

[Finding Thargoids](/finding-thargoids){: .btn } [Thargoid Interceptors](/interceptors){: .btn } [Thargoid Special Attacks](/special-attacks){: .btn }

## Browse All Pages

<div id="pagelistbox" class="grid-container">
    {% for page in site.guides %}
        <a id="pagelistitem" class="grid-item" href="{{ site.baseurl }}{{ page.permalink }}"><div class="listitemtitle">{{ page.title }}</div><div class="listitemdescription">{{ page.description }}</div></a>
    {% endfor %}
    {% for page in site.thargoids %}
        <a id="pagelistitem" class="grid-item" href="{{ site.baseurl }}{{ page.permalink }}"><div class="listitemtitle">{{ page.title }}</div><div class="listitemdescription">{{ page.description }}</div></a>
    {% endfor %}
    {% for page in site.builds %}
        <a id="pagelistitem" class="grid-item" href="{{ site.baseurl }}{{ page.permalink }}"><div class="listitemtitle">{{ page.title }}</div><div class="listitemdescription">{{ page.description }}</div></a>
    {% endfor %}
    {% for page in site.science %}
        <a id="pagelistitem" class="grid-item" href="{{ site.baseurl }}{{ page.permalink }}"><div class="listitemtitle">{{ page.title }}</div><div class="listitemdescription">{{ page.description }}</div></a>
    {% endfor %}
    {% for page in site.studies %}
        <a id="pagelistitem" class="grid-item" href="{{ site.baseurl }}{{ page.permalink }}"><div class="listitemtitle">{{ page.title }}</div><div class="listitemdescription">{{ page.description }}</div></a>
    {% endfor %}
</div>

## Credits

A big thanks to our content and development team! ❤️

### Translators

-   CMDR alterNERDtive
-   CMDR Trex63
-   CMDR Xarionn
-   CMDR St4n2012
-   CMDR Trebiscotti
-   CMDR AlexMG1
-   CMDR Domtron
-   CMDR Grincake
-   CMDR Batro
-   CDMR Blaston
-   CMDR Aileen Leith
-   CMDR Westboyrke
-   CMDR Habba-nero
-   CMDR Talixe
-   CMDR Jugom
-   CMDR Nauva
-   CMDR panther\_neo
-   CMDR SGUDestiny
-   CMDR Archiebeales
-   CMDR Konstantine Novakov
-   CMDR Eckee

### Content Creators

-   CMDR Aranionros Stormrage
-   CMDR Mechan
-   CMDR Aterius
-   CMDR EuanAB
-   CMDR Avasa Siuu
-   CMDR Maligno

### Developers

-   CMDR Mgram
-   CMDR Sanctified (Willhof)