# Wiki Project Home

This is the Site repo for the AXI wiki, a project setup to migrate the original AXI wiki to a free hosted github pages environment. 

This system stores pages as Markdown Document files and uses the just-the-docs template to build the pages with Jekyll. Read more about [Just the Docs Here](https://just-the-docs.com/) and [Jekyll](https://jekyllrb.com/docs/pages/)

## Page Structure

Each page is a markdown file, the file starts with a header that contains page information that is used to generate the page, here is an example: 

```
---
title: Basic Combat Guide
permalink: /basic-combat-guide
layout: default
nav_order: 2
description: The fundamental concepts of AX combat and how to fight an Interceptor.
---
```

`title` - sets the page title that appears in the navigation
`permalink` - creates a redirect link that allows the page to be reached at the base url ie: wiki.antixenoinitiative.com/**basic-combat-guide**, use the formatting with "-" to replace spaces and all LOWERCASE.
`layout` - set the default page template, read more in [JTD Documentation](https://just-the-docs.com/)
`nav_order` - sets the order in navigation
`description` - not required but used on the home page to generate the navigation link

## Page links
To ensure links work in both dev and test environments and to ensure pages link correctly, use the liquid language to generate the urls directly inside each file.

Each Hyperlink between pages should use the following format: 

{% raw %}
```
[<Hyperlink text>]({{ site.baseurl }}/<page-name>)

Example: 
[Cold Orbiting]({{ site.baseurl }}/cold-orbiting)
```
{% endraw %}



## Importing from the old wiki

Work is required to import pages from the old wiki into this site, the old wiki is being automatically synced to a seperate Github repo where it can be found in similar markdown format, manual work is needed to migrate these pages over from the old repo.

[OLD AXI Wiki Synced Repo](https://github.com/antixenoinitiative/axiwiki)