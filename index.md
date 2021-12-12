---
layout: default.liquid
title: J5e - Robotics and IoT JavaScript framework for Embedded Devices
---
# <img class="h-12 my-4 lg:hidden" src="/images/J5e.svg" />
<h1 class="h2">Robotics and IoT JavaScript Framework for Embedded Systems</h1>
<img width="40%" align="right" alt="A robot poking its head out from inside washing machine" style="margin:0 0 35px 35px;" src="/images/J5-embedded-666x666.png" class="hidden sm:block" />

Listen to a wide variety of sensors or control LED's, Servos, Switches, and more with J5e. It runs onboard microcontrollers like the ESP8266 or ESP32. Your code is 100% JavaScript. It does not require node.js, a host server or a single board computer to host the app.

J5e is a device framework built upon [ECMA-419](https://www.ecma-international.org/publications-and-standards/standards/ecma-419/), the Embedded Systems API Specification for ECMAScript. ECMA-419 provides a standard interface for accessing underlying hardware interfaces (GPIO). J5e's API is inspired and heavily influenced by the awesome [Johnny-Five](https://github.com/rwaldron.johnny-five) API which has been battle tested over quite some time. 

Currently, the only provider that conforms to ECMA-419 is [Moddable's IO module for XS](https://github.com/Moddable-OpenSource/moddable/blob/public/documentation/io/io.md) which runs on ESP32 and ESP8266 based devices. 

## J5e in action
````js
// Load a module
import LED from "j5e/led";

// Create a device instance on pin 14
const led = await new LED(14);

// Tell it to blink
led.blink();
````

![Node.js CI](https://github.com/dtex/j5e/workflows/Node.js%20CI/badge.svg)
