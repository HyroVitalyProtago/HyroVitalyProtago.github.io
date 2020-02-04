---
layout: post
title: HTML needs to be semantic only
category: article
language: en
date: 2019-05-06 18:27:20 +0000
slug: '182720'
---
As every front developer know, HTML is for the content and CSS is for the style. But all times, we add divs to the HTML only to style the content in a easier way.

> \<div> has no semantic meaning, so it is quite useful whenever we are altering the HTML purely for the sake of styling purposes. \
> — https://css-tricks.com/how-to-section-your-html/

There is a need to completly remove the divs with no semantic role from our websites. So the first question is : why it is easier to add a div ? This is easier for two reasons : you can easily group/encapsulate multiples elements and you can name it as a reference inside your CSS.

So, the second question is : can we group visual things without HTML and give a name to this virtual groups? I think so, because now there is [Grids](https://css-tricks.com/snippets/css/complete-guide-grid/).

[Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) is the new way to handle list of things that aren't text. But they need _divs_ to be organized in hierarchy and handle list of elements properly. That's not the case of Grids. And this website proves it. The HTML is only semantic and I only use _divs_ and _spans_ to add informations about the role of the content.
