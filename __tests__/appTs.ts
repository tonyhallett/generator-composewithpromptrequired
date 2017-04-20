

'use strict';
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
/* eslint max-params: ["error", 5] */
var promptCalled = false;
var mockPromptArgs = ['requiredArgument1'];
jest.mock('../generators/app/helpers/promptMissingArgs.ts', () => {
    return jest.fn(() => {
        promptCalled = true;
        return Promise.resolve(mockPromptArgs);
    });
});
import * as Generator from 'yeoman-generator';
//var Generator = require('yeoman-generator');

import * as path from 'path'
//var path = require('path');
import * as helpers from 'yeoman-test';
//var helpers = require('yeoman-test');

import appGenerator = require('../generators/app');
//import * as dummyRequirementIgnored from '../generators/app/';
//var dummyRequirementIgnored = require('../generators/app/');

interface ObjectAny extends Object {
    [name: string]: any;
}

var composedNamespace = 'wrappedGenerator';
var composedArgs: string | string[];
var composedOptions: ObjectAny;
var composedInitializingInRunLoop;
var composedGenerator = class extends Generator {
    constructor(args: string | string[], opts: {}) {
        composedArgs = args;
        composedOptions = opts;
        super(args, opts);
    }
    initializing() {
        composedInitializingInRunLoop = true;
    }
};

var dummyDerivedGenerator = class extends appGenerator {
    constructor(args: string | string[], opts: {}) {
        super(args, opts);
        this.option('derivedOption', { default: 'derivedOption' });
    }
    initializing() {
        return this.initializingBase();
    }

    // Must have a run loop method or exception
    end() { }
};

describe('my generator', () => {
    var subGeneratorOptions = { subGeneratorOption1: true };
    function helpersRun(withArguments: string | Array<string>, withOptions: ObjectAny) {
        return new Promise(resolve => {
            helpers.run(dummyDerivedGenerator)
                .withGenerators([[composedGenerator, composedNamespace]])
                .withOptions(withOptions)
                .withArguments(withArguments)
                .then(dir => {
                  resolve(dir);
                });
        });
    }
    beforeAll(() => {
        return helpersRun([composedNamespace], subGeneratorOptions);
    });

    it('should prompt for missing arguments', () => {
        expect(promptCalled).toBe(true);
    });
    // As long as the prompt does not throw promise rejection - if that is indeed possible
    it('should compose with wrapped with args and options intended for it', () => {
        expect(composedOptions.subGeneratorOption1).toBe(true);
        expect(composedOptions).not.toHaveProperty('derivedOption');
        expect(composedOptions).not.toHaveProperty('wrappedGeneratorName');
        expect(composedArgs).toEqual(mockPromptArgs);
        expect(composedInitializingInRunLoop).toBe(true);
    });
});



