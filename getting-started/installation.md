---
layout: default.liquid
title: Installation
---
# Installation

## Using J5e with the Moddable SDK and npm. 

#### 1. Make sure you have successfully [configured your host environment](https://github.com/Moddable-OpenSource/moddable/blob/public/documentation/Moddable%20SDK%20-%20Getting%20Started.md) for the Moddable SDK. 

#### 2. [Install npm](https://docs.npmjs.com/cli/v10/configuring-npm) if you don't already have it on your dev system.

#### 3. Create a working directory (You can call it whatever you want):

````bash
cd ~/Projects;
mkdir myProject;
cd myProject;
````

#### 4. Initialize your project with npm:

````bash
npm init -y;
````

#### 5. Add J5e as a dependency:

````bash
npm install j5e;
````

#### 6. Create your ```main.js``` program file. Here is the ubquitous "Hello World" for hardware to get you started:

````js
import LED from "j5e/led";

const led = await new LED(14);
led.blink();
````

This assumes you have an LED wired to pin 14 on your microcontroller.

#### 7. Now you're ready to build your program and upload it to your microcontroller (refer to the [Moddable docs](https://github.com/Moddable-OpenSource/moddable/tree/public/examples#building-apps) for help with this):

````bash
mcconfig -d -m -p esp/nodemcu
````
This assumes you are using an esp8266 based nodemcu devkit .