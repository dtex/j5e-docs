const jsdoc = require('jsdoc-api');
const fs = require('fs-extra');

module.exports = function(eleventyConfig) {
  
  let modules = fs.readdirSync("./node_modules/j5e/lib");

  modules = modules.filter(module => module !== ".DS_Store");

  return modules;

}
 