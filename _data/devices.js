const jsdoc = require('jsdoc-api');
const fs = require('fs-extra');

module.exports = function(eleventyConfig) {
  
  let devices = [];
  let modules = fs.readdirSync("./node_modules/j5e/lib");

  modules = modules.filter(module => module !== ".DS_Store");

  modules.forEach(module => {
    let moduleDevices = fs.readdirSync(`./node_modules/j5e/lib/${module}`, { withFileTypes: true })
    moduleDevices = moduleDevices.filter(device => device.isDirectory());
    moduleDevices = moduleDevices.map(device => device.name);
    devices.push(...moduleDevices);
  });

  return devices;

}
 