markdown-mod
============

Makes the built-in [markdown](https://www.home-assistant.io/lovelace/markdown/) card better.

For installation instructions [see this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).

Install `markdown-mod.js` as a `module`.

## Usage
This is *not* a new card. Instead it *changes the way the built-in markdown card works*.

Specifically, it adds the ability to have the content of the card change dynamically with your Home Assistant state.

The magic begins with the **template** `[[ <template> ]]`.

Any time `[[ <template> ]]` is found in the `content:` of any markdown card, it will be replaced with something else depending on what `<template>` is.

It can be:

| `<template>` | Example | Result
| ------------ | ------- | ------
| Entity id | `light.bed_light` | The current state of the entity
| State | `light.bed_light.state` | Same as above
| Attribute | `light.bed_light.attributes.friendly_name` | The current value of the specified entitys specified attribute
| Username | `{user}` | The username of the currently logged in user
| Device ID | `{browser}` | The ID of the currently used device-browser combination
| Hash | `{hash}` | The hash part of the current URL
| Conditional | `if(<condition>, <then>, <else>)` | The template in `<then>` if `<condition>` is true. Otherwise `<else>`.

In the conditional case, `<then>` and `<else>` can be any of the above templates (including Conditional).

`<condition>` is of the form `<template> <comparison> <template>` where `<comparison>` is one of `==`, `!=`, `<`, `>`, `<=` or `>=`.

## Example
```yaml
type: markdown
title: Default markdown card
content: |
  # Title
  ## Subtitle
  - list
  - items

  [A link](https://google.com)

  [[ light.bed_light.state ]] [[ light.bed_light ]] [[ light.bed_light.attributes.friendly_name ]]
  [[ sensor.mysensor.state ]]%

  Username: [[ {user} ]] Browser ID: [[ {browser} ]]
  Current URL hash: [[ {hash} ]]

  [[ if(light.bed_light == "on", "The lights are on", "It's dark") ]]
  [[ if(input_number.x_pos <= 30, "small", if(input_number.x_pos <= 70, "Medium", "LARGE")) ]]
  [[ sensor.outside_temperature.last_updated ]]
```

![markdown-mod](https://user-images.githubusercontent.com/1299821/59043091-e8d2e100-887b-11e9-9c31-4512bd2ebc47.gif)

---
<a href="https://www.buymeacoffee.com/uqD6KHCdJ" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>
