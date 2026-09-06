---
title: "READ ME for New Editors"
description: "Editing Principles and Wiki Design Goals"
date: 2023-08-29T14:51:12.553Z
tags: editor
---


::: tip Developer & Translation Guide
For a full technical guide on running the site locally with VitePress, formatting rules, custom Vue components (`<AxiTabs>`), and translating pages, please read the **[Contributing & Developer Guide](/editing-guide)**.
:::

# Welcome, Editor!

Thank you for contributing to the Anti-Xeno Initiative Wiki!

There are a few guiding principles we want all of our editors to be familiar with before beginning their hard work.

The following section is written to provide examples of thoughtfulness desired in our editors. There are a few notes to explain how the wiki is maintained as well as provide direction to immediate work that could be done to improve the AXI wiki.

We want to be in agreement before restructuring the wiki, so please check with AXI staff before adding, moving, or removing major sections.

When planning a page edit, if there is a "primary editor" of a page, check with them as a courtesy before committing changes. For example, Airom has done a bunch of work on recommended builds, Mechan created the cursed builds page, etc. Please communicate with them first about your ideas.

If your changes include adding new media assets (like diagrams or screenshots), place them in `docs/public/img/` and commit them to the repository rather than hotlinking external image hosts. This ensures the wiki maintains an archive of all assets and prevents broken links over time.

The user experience for the information published by AXI can be inconsistent and difficult to navigate. Clearly written goals and evaluations are proposed for changes to improve the user experience and accuracy of the information presented within the wiki. The overall goal should be to provide the community with an effective and concisely written primary repository of AXI-related articles. 

Fixing typos and grammatical mistakes are always welcome!

### AXI Staff Members for Wiki Supervision

The members listed below have been entrusted with managing the wiki and reviewing contributions:

| CMDR | Discord Handle |
|---|---|
| CMDR Mechan | @astyrrean |
| CMDR Avasa Siuu | @arsspartanash |
| CMDR Grimscrub | @grimscrub |
| CMDR Darth_Vader | @darth__vader |
| CMDR Aranionros Stormrage | @aranionros |
| CMDR Toyotanos | @toyotanos |
| CMDR Pyrocujo | @pyrocujo |

### Wiki Operations & Architecture

The Anti-Xeno Initiative Wiki is built using **[VitePress](https://vitepress.dev/)** and hosted on **GitHub Pages**.

- All page content is stored as Markdown (`.md`) files under the `docs/` directory.
- Edits are proposed via GitHub Pull Requests. When a PR is approved and merged into `master`/`main`, a GitHub Actions workflow automatically builds the static site and deploys it live.
- Pages can be edited directly on GitHub using the web editor, or cloned locally for live previews using `npm run docs:dev`.
- See the **[Contributing & Developer Guide](/editing-guide)** for step-by-step setup and writing conventions.


# Webpages Listed
---
Consider the following section as a roadmap for achieving the goal improving user experiences.
The following Webpages' Goals and Effects section is formatted; 

[Page Name and link]()
---
  - Webpage short description
  - Webpage's intended goals
  - An evaluation of whether the webpage achieves its goals, and
  - Any recommendations for changes.

Consider adding your page below and define its goals so we can get the most out of your work!

---

### [Home page](/)
- Introduction to the AXI wiki
- Provides immediate direction to the audience what to expect from and how to use this wiki, a logical starting place for the new user, quicklinks for high-priority popular topics, and an invitation to contribute to the wiki.
- Instructions for how to use this wiki are unclear
- Adding a section to explain page navigation and maybe express that several features appear on every page that the average user cannot utilize could help to proactively set user expectations. For example, who can comment on any given page.

### [Read Me for New Editors](/READ_ME_New_Editors)
- Introduction for users that have been granted editing permissions
- This page needs to lay ground rules for editorial work and also lay out some kind of organizational plan so future iterations of AXI webpages are effective and useful.
- It's currently in its first revision and could use input from everyone
- An exhaustive list could be produced for all the webpages and could use the evaluation/recommendation treatment. Perhaps a section on Staff members could be explicitly provided so that the above instruction, "check with AXI staff" can be clearly and completely understood.

### [Thargoids](/thargoids)
- Introduction to the Thargoid xenos
- Introduce the average pilot to Thargoids; provide context to the audience "so what's a Thargoid and what does it have to do with me?" Provide references for the interested audience to study Thargoids in greater detail
- the page does not succeed in "what does it have to do with me" but indirectly provides an overview, that they are dangerous, humanity has develeped x, and pilots can fight them. 
- A section could be written to follow up "the Thargoids are a nonhuman race with a history of hostility towards humanity" to the effect of "we are at war... pilots that choose to attempt combat with Thargoids are rewarded for their bravery... AXI Ranks for distinguishing accomplished combatants, etc."

### [Maelstrom](/Maelstrom)
- A Pilot's one-stop shop for everything Maelstrom related
- Introduces the Maelstrom, explains the commmon activities to do there, provides recommendations for those activities, and provides a placeholder for currently unreleased war mechanics
- 
- add recommendations for Titan combat section

### Definitions
- a collection of AXI jargon and what it means
- Compile in one location commonly used names, phrases, and words that have particular meaning to AXI within the context of Elite Dangerous.
- this page does not exist yet
- 

### Updates
- a quick reference for all wiki users to see what's new
- Allows editors a convenient place to "announce" changes and/or fixes they've made to the wiki.
- 
-

### [Input Overlays](/input_overlays)
- Starting point for players to learn the most convenient input overlay setups to expand their toolset.
- Explain input overlays and common usage, then direct users to setup guides and resources.
- 
- 