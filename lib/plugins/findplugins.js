'use strict';

var fs = require('fs');
var output = __dirname + '/foundplugins.js';
var filtered = ['index.js', 'findplugins.js', output];

function find() {
  var files = fs.readdirSync(__dirname);


  var pluginFiles = files.filter(function (file) {
    return filtered.indexOf(file) == -1;
  });

  var registerSource = '    plugins.register([\n      ' + pluginFiles.map(function(file) {
    return "require('./" + file + "')()"
  }).join('\n      , ') + '\n    ]);';

  console.info('>>>registerSource', registerSource);

  var lines = [
    "'use strict';"
    , ""
    , "///////////////////////////////////////////////////"
    , "// GENERATED FILE: update with `npm findplugins` //"
    , "///////////////////////////////////////////////////"
    , ""
    , "function init() {"
    , "  function foundplugins() { return foundplugins; }"
    , "  foundplugins.register = function register(plugins) {"
    , registerSource
    , "  }"
    , "  return foundplugins();"
    , "}"
    , ""
    , "module.exports = init;"
    , ""
  ];

  var fd = fs.openSync(output, 'w');

  fs.writeFileSync(output, lines.join('\n'));

  fs.closeSync(fd);
}

find();