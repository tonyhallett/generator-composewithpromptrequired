'use strict';
import * as Generator from 'yeoman-generator';

import promptMissingArgs = require('./helpers/promptMissingArgs');


function optionPropertyIsArgument(propName: string, _arguments: Generator.ArgumentConfig[]): boolean {
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

interface ObjectAny {
    [name: string]: any;
}

export = class extends Generator {
    constructor(args: string | string[], opts: ObjectAny) { // Can be called just for help information
        // Don't get this without super call
        super(args, opts);
        this.argument('wrappedGeneratorName', { required: true });
    }
    initializingBase():Promise<void> {
        var wrappedGeneratorName:string = this.options.wrappedGeneratorName;
        return promptMissingArgs(this.env, this.arguments, this._arguments, wrappedGeneratorName, this.prompt).then(res => {
            if (res) {
                var options = { arguments: res };
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
    //_end() {
    //    /* To do - spawnCommand should be called in the install queue.  _end is hidden */
    //    var folderPath = this.destinationRoot();
    //    var fileOpenFolder = '"file.openfolder"';
    //    var safeFolderPath = '"' + folderPath + '"';
    //    this.spawnCommand('devenv', [safeFolderPath + '/command ' + fileOpenFolder]);
    //}
    end() { }
};