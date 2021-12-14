const jsdoc = require('jsdoc-api');
const fs = require('fs-extra');
const { comment } = require('postcss');

module.exports = function(eleventyConfig) {
  
  let result = [];
  let modules = fs.readdirSync("./node_modules/j5e/lib");

  modules = modules.filter(module => module !== ".DS_Store");

  let devices = [];
  
  let modulePaths = modules.map(module => {
    
    let moduleDevices = fs.readdirSync(`./node_modules/j5e/lib/${module}`, { withFileTypes: true })
    moduleDevices = moduleDevices.filter(device => device.isDirectory());
    moduleDevices = moduleDevices.map(device => {
      device = `./node_modules/j5e/lib/${module}/${device.name}/index.js`;
      return device;
    });
    devices.push(...moduleDevices);
    
    return `./node_modules/j5e/lib/${module}/index.js`;
  });

  modulePaths.push(...devices);

  let jsdocData = jsdoc.explainSync({ files: modulePaths });
  
  modules = modules.map((module, index) => {
    
    let main = jsdocData.filter(comment => {
      return comment.kind === "module" && comment.name === `j5e/${module}`;
    })[0];
    
    // function, member, constant, package
    main.classes = jsdocData.filter(comment => {
      return comment.kind === "class" && comment.memberof === main.longname  && !comment.undocumented;
    });

    main.classes.forEach(thisClass => {
      
      thisClass.isDevice = thisClass.longname.indexOf(".") > -1;
      
      thisClass.methods = jsdocData.filter(comment => {
        return comment.kind === "function" && comment.memberof === thisClass.longname  && !comment.undocumented;
      });

      thisClass.properties = jsdocData.filter(comment => {
        return comment.kind === "member" && comment.memberof === thisClass.longname  && !comment.undocumented;
      });

    });

    main = linkify(main);

/*

    classes = classes.map(thisClass => {
      
      if (thisClass.params) {
        thisClass.params = thisClass.params.map(param => {
          param.description = linkable(param.description);
          return param;
        });
        thisClass.primaryParams = thisClass.params.filter(param => {
          return param.name.indexOf(".") === -1;
        });
      }

      thisClass.methods = methods.filter(method => {
        return method.memberof === `module:${main[0].name}~${thisClass.name}`;
      });

      thisClass.methods = thisClass.methods.map(method => {
        if (method.params) {
          method.params = method.params.map(param => {
            param.description = linkable(param.description);
            return param;
          });
          method.primaryParams = method.params.filter(param => {
            return param.name.indexOf(".") === -1;
          });
        }
        return method;
      });

      thisClass.properties = properties.filter(property => {
        return property.memberof === `module:${main[0].name}~${thisClass.name}`;
      });

      return thisClass;
    });

    let result = {
      name: module,
      description: main[0].description,
      title: main[0].name,
      private: main[0].ignore,
      see: main[0].see,
      examples: main[0].examples,
      requires: main[0].requires,
      classes: classes
    };
    
    // examples
    */
    
    return main; 
  });
  
  return modules;

}

function linkify(node) {
  
  if (Array.isArray(node)) {
    node = node.map(node => { 
      return linkify(node); 
    }); 
  } else if (node === null) {
    return null;
  } else if (typeof node === "object") {
    Object.keys(node).forEach(key => {
      node[key] = linkify(node[key]);
    });
  }
  
  if (typeof node === "string") {
    return linkable(node);
  }

  return node;
};

function linkable(text) {
  let links = /([^{]*){@link ([^|]*)\|([^}]*)}(.*)/;
  let match = links.exec(text);
  
  if (!match) {
    return text;
  }

  text = match[1] + `<a href="${match[2]}">${match[3]}</a>` + match[4];
  return text;
}
 