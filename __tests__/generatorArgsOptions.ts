/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "[iI]gnored" }] */

import * as jestExtensions from 'jestExtensions';
debugger;

var pit = jestExtensions.pit;
var pits = jestExtensions.pits;


import sniffer = require('../generators/app/helpers/generatorArgsOptionsSniffer');
import * as path from 'path';

var mockGeneratorPath = path.resolve(__dirname, '../generators/app/');
describe('sniffer', () => {
  var argsOptions;
  var mockGenerator = {_options: 'opts', _arguments: 'args'};

  var mockedRequiredGenerator = function () {
        // Hello
  };
  function mockRequireGenerator(mockThrows) {
    jest.mock(mockGeneratorPath, () => {
      if (mockThrows) {
        var error:any = new Error();
        error.code = 'MODULE_NOT_FOUND';
        throw error;
      }
      return mockedRequiredGenerator;
    });
  }
  beforeEach(() => {
    jest.resetModules();
    this.mockEnvironment = {
      namespace: genNameIgnored => {
        return 'namespace';
      },
      instantiate: jest.fn((genIgnored, optsArgsIgnored) => {
        return mockGenerator;
      }),
      create: jest.fn((genIgnored, optsArgsIgnored) => {
        return mockGenerator;
      })
    };
  });

  pit('when requiring the generator ctor does not throw, should instantiate through the environment and return configs', false, () => {
    expect(this.mockEnvironment.instantiate.mock.calls[0][0]).toBe(mockedRequiredGenerator);
  });
  pit('when requiring the generator ctor throws, should create through the environment and return configs', true, () => {
    expect(this.mockEnvironment.create.mock.calls[0][0]).toBe(mockGeneratorPath);
  });

  pits((throws, specificTest) => {
    mockRequireGenerator(throws);
    argsOptions = sniffer(this.mockEnvironment, mockGeneratorPath);
    expect(argsOptions.options).toEqual(mockGenerator._options);
    expect(argsOptions.arguments).toEqual(mockGenerator._arguments);
    specificTest();
  });
});
