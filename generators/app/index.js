'use strict';
const Generator = require('yeoman-generator');
var promptMissingArgs = require('./helpers/promptMissingArgs');

function optionPropertyIsArgument(propName, _arguments) {
  var matched = false;
  for (var i = 0; i < _arguments.length; i++) {
    var _argument = _arguments[i];
    matched = _argument.name === propName;
    if (matched) {
      break;
    }
  }
  return matched;
}

module.exports = class extends Generator {
  constructor(args, opts) { // Can be called just for help information
    // Don't get this without super call
    super(args, opts);

    this.argument('wrappedGeneratorName', {required: true});
  }
  initializingBase() {
    var wrappedGeneratorName = this.options.wrappedGeneratorName;
    return promptMissingArgs(this.env, this.arguments, this._arguments, wrappedGeneratorName, this.prompt).then(res => {
      if (res) {
        var options = {arguments: res};
        for (var prop in this.options) {
          if (!optionPropertyIsArgument(prop, this._arguments) && Object.prototype.hasOwnProperty.call(this.options, prop)) {
            if (!Object.prototype.hasOwnProperty.call(this._options, prop)) {
              options[prop] = this.options[prop];
            }
          }
        }
        this.composeWith(wrappedGeneratorName, options);
      }
    });
  }
  // This to be moved to the vsgenerator
  _end() {
      /* To do - spawnCommand should be called in the install queue.  _end is hidden */
    var folderPath = this.destinationRoot();
    var fileOpenFolder = '"file.openfolder"';
    var safeFolderPath = '"' + folderPath + '"';
    this.spawnCommand('devenv', [safeFolderPath + '/command ' + fileOpenFolder]);
  }
  end() { }
};
