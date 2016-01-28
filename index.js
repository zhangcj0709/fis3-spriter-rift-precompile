'use strict';

var handlebars = require('handlebars');


var cwd = fis.processCWD || process.cwd();


function normalizePath(to, root) {
  if (to[0] === '.') {
    to = fis.util(cwd + '/' + to);
  } else if (/^output\b/.test(to)) {
    to = fis.util(root + '/' + to);
  } else if (to === 'preview') {
    to = serverRoot;
  } else {
    to = fis.util(to);
  }
  return to;
}

module.exports = function(ret, conf, settings, opt) {
  var compiledContent = '';
  compiledContent += '(function() {\n';
  compiledContent += 'var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};\n';
  fis.util.map(ret.src, function(subpath, file) {
      if (file.precompileId) {
          //预编译handlebars模板
          compiledContent += ('templates["' + file.precompileId + '"] = template(' + handlebars.precompile(file.getContent(), settings) + ');\n');
      }
  });
  compiledContent += '})();';

  var to = normalizePath(settings.to || './templates.js',  fis.project.getProjectPath());
  fis.util.write(to, compiledContent, 'UTF-8', false);
  fis.log.info("Precompiled handlebars templates to '" + to + "'!");
};


/*(function() {

var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};

// 下面是模板打包：

templates["/组件1/templates/模板1"] = template(function(...)

templates["/组件1/templates/模板2"] = template(function(...)

templates["/组件2/templates/模板1"] = template(function(...)

})();*/