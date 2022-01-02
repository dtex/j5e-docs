const jsdoc = require('jsdoc-api');
const fs = require('fs-extra');
const { comment } = require('postcss');
const fetch = require('node-fetch-cache');

module.exports = async function(eleventyConfig) {
  
  let modules = fs.readdirSync("./node_modules/j5e/lib");

  modules = modules.filter(module => module !== ".DS_Store");

  let devices = [];
  let devicePaths = [];
  
  let modulePaths = modules.map(module => {
    
    let moduleDevices = fs.readdirSync(`./node_modules/j5e/lib/${module}`, { withFileTypes: true })
    moduleDevices = moduleDevices.filter(device => device.isDirectory());
    moduleDevices = moduleDevices.map(device => device.name);
    devices.push(...moduleDevices);

    moduleDevices = moduleDevices.map(device => {
      device = `./node_modules/j5e/lib/${module}/${device}/index.js`;
      return device;
    });
    devicePaths.push(...moduleDevices);
    
    return `./node_modules/j5e/lib/${module}/index.js`;
  });

  modules.push(...devices);
  modulePaths.push(...devicePaths);

  let jsdocData = jsdoc.explainSync({ files: modulePaths });
  jsdocData = jsdocData.filter(comment => {
    return comment.access !== "private";
  })

  let jsdocModules = jsdocData.filter(doc => doc.kind === "module");
  
  // let myKeys = [];
  // let rosetta = {};
  // jsdocData.forEach(comment => {
  //   myKeys.push(...Object.keys(comment));
  // });
  // myKeys = myKeys.filter(onlyUnique);

  // myKeys.forEach(key => {
  //   rosetta[key] = [];
  // });

//   jsdocData.forEach(comment => {
//     Object.keys(comment).forEach(key => {
//       if (key === "comment") return;
//       if (key === "meta") return;
//       if (key === "description") return;
//       if (rosetta[key].indexOf(comment[key]) === -1 ) {
//         rosetta[key].push(comment[key]);
//       }
//     });
//   });

//   /* 'comment',      'meta',      'description',
//   'kind',         'name',      'requires',
//   'longname',     'classdesc', 'augments',
//   'fires',        'scope',     'memberof',
//   'undocumented', 'params',    'examples',
//   'returns',      'access',    'async',
//   'type',         'readonly',  'see',
//   'author',       'tags',      'inheritdoc',
//   'properties',   'overrides', 'files',
//   'inherits',     'inherited'*/
//   console.log(rosetta.kind);

//   /* [
//   'module',
//   'class',
//   'member',
//   'function',
//   'constant',
//   'namespace',
//   'package'
// ] */
//   console.log("module", jsdocData.filter(doc => doc.kind === "module").length);
//   console.log("class", jsdocData.filter(doc => doc.kind === "class").length);
//   console.log("member", jsdocData.filter(doc => doc.kind === "member").length);
//   console.log("function", jsdocData.filter(doc => doc.kind === "function").length);
//   console.log("constant", jsdocData.filter(doc => doc.kind === "constant").length);
//   console.log("namespace", jsdocData.filter(doc => doc.kind === "namespace").length);
//   console.log("package", jsdocData.filter(doc => doc.kind === "package").length);
  
  modules = modules.map((module, index) => {
    
    let main = jsdocModules.filter((comment, i) => {
      return comment.name === `j5e/${module}`;
    })[0];

    main.wikiLinks = main.tags?.filter(tag => {
      return tag.value.indexOf("https://en.wikipedia.org/wiki/") !== -1;
    });

    // function, member, constant, package
    main.classes = jsdocData.filter(comment => {
      return comment.kind === "class" 
        && comment.memberof === main.longname
        //&& comment.longname.indexOf(".") === -1  
        && !comment.undocumented;
    });

    main.devices = jsdocData.filter(comment => {
      if (!comment.augments) return false;
      
      let augmentsMain = comment.augments.find(base => {
        return base.indexOf(`j5e/${module}`) !== -1;
      });
      
      return augmentsMain
        && comment.longname.indexOf(".") !== -1
        && !comment.undocumented
        && comment.kind === "class";
    });

    if (main.devices.length === 0) {
      delete main.devices;
    }

    main.classes.forEach(classComment => {
      classComment.functions = jsdocData.filter(comment => {
        return comment.kind === "function"
          && comment.memberof === classComment.longname
          && !comment.undocumented;
      });
    });

    // function, member, constant, package
    main.members = jsdocData.filter(comment => {
      return comment.kind === "member" 
        //&& comment.memberof === main.longname  
        && !comment.undocumented;
    });

    main.classes.forEach(thisClass => {
      
      thisClass.methods = jsdocData.filter(comment => {
        return comment.kind === "function" && comment.memberof === thisClass.longname  && !comment.undocumented;
      });

      thisClass.properties = jsdocData.filter(comment => {
        return comment.kind === "member" && comment.memberof === thisClass.longname  && !comment.undocumented;
      });

    });

    main = linkify(main);
    
    return main; 
  });

  await asyncForEach(modules, async module => {
    if (module.wikiLinks?.length > 0) {
      await asyncForEach(module.wikiLinks, async wikiLink => {
        let apiURL = wikiLink.value.replace("https://en.wikipedia.org/wiki/", "https://en.wikipedia.org/api/rest_v1/page/summary/");
        apiURL = apiURL.replace("{@link ", "").replace("}", "");
        let apiResponse = await fetch(apiURL);
        
        if(!apiResponse.fromCache) {
          await pause(1000);
        };
        let json = await apiResponse.json();
        module.description = module.description + json.extract_html.replace('</p>', '<span class="-mt-4 text-right text-xs pl-2"><a href="'+ wikiLink.value + '">Read more on Wikipedia</a></span></p>');
      });
    }
  });
  
  return modules;

}

async function pause(duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
  
  
  
  async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

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
 
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}