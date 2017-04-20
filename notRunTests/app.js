'use strict';
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
/* eslint max-params: ["error", 5] */
var promptCalled = false;
var mockPromptArgs = ['requiredArgument1'];
jest.mock('../generators/app/helpers/promptMissingArgs.js', () => {
  return jest.fn(() => {
    promptCalled = true;
    return Promise.resolve(mockPromptArgs);
  });
});
var Generator = require('yeoman-generator');

var path = require('path');
var helpers = require('yeoman-test');

var dummyRequirementIgnored = require('../generators/app/');

var composedNamespace = 'wrappedGenerator';
var composedArgs;
var composedOptions;
var composedInitializingInRunLoop;
var composedGenerator = class extends Generator {
    // Supposedly this is unnecessary http://eslint.org/docs/rules/no-useless-constructor
    // http://eslint.org/docs/user-guide/configuring
  constructor(args, opts) {
    composedArgs = args;
    composedOptions = opts;
    super(args, opts);
  }
  initializing() {
    composedInitializingInRunLoop = true;
  }

};

describe('my generator', () => {
  var subGeneratorOptions = {subGeneratorOption1: true};
  function helpersRun(withArguments, withOptions) {
    return new Promise(resolve => {
      helpers.run(path.join(__dirname, '../modules_for_tests/dummyDerivedGenerator'))
          .withGenerators([[composedGenerator, composedNamespace]])
          .withOptions(withOptions)
          .withArguments(withArguments)// Can be an array or a string
                // use this event if need the created generator
                // .on('ready', gen => {

                // })
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

