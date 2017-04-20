/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }] */
/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "[iI]gnored" }] */

var mockArgsOptions;
var mockArgsOptionsSniffer;
jest.mock('../generators/app/helpers/generatorArgsOptionsSniffer', () => {
  mockArgsOptionsSniffer = jest.fn((envIgnored, genNameIgnored) => {
    return mockArgsOptions;
  });
  return mockArgsOptionsSniffer;
});

var jestExtensions = require('jestExtensions');
expect.extend({allObjectsContaining: jestExtensions.matchers.allObjectsContaining});
var its = jestExtensions.its;
var promptMissingArgs = require('../generators/app/helpers/promptMissingArgs');

describe('prompt missing args', () => {
  var mockEnv = {};
  var wrappedGeneratorName = 'wrappedGenerator';
  describe('should or should not call the prompt', () => {
    beforeEach(() => {
      this.prompt = jest.fn(() => Promise.resolve());
    });
    its(
      [
        {
          description: 'should prompt when passed args less than sub required',
          arguments: [
                        [wrappedGeneratorName],
                        [{name: 'required', required: true}],
            {
              arguments: [
                                {name: 'subRequired', required: true},
                                {name: 'subNotRequired', required: false}
              ]
            },
                        [{name: 'subRequired', type: 'input'}]
          ]
        },
        {
          description: 'should prompt ( multiple ) when passed args less than sub required',
          arguments: [
                        [wrappedGeneratorName],
                        [{name: 'required', required: true}],
            {
              arguments: [
                                {name: 'subRequired', required: true},
                                {name: 'subRequired2', required: true},
                                {name: 'subNotRequired', required: false}
              ]
            },
                        [{name: 'subRequired', type: 'input'}, {name: 'subRequired2', type: 'input'}]
          ]
        },
        {
          description: 'should not prompt when passed same no of args as sub required',
          arguments: [
                        [wrappedGeneratorName, 'anotherArg'],
                        [{name: 'required', required: true}],
            {
              arguments: [
                                {name: 'subRequired', required: true},
                                {name: 'subNotRequired', required: false}
              ]
            },
            false
          ]
        },
        {
          description: 'should not prompt when passed more args than sub required',
          arguments: [
                        [wrappedGeneratorName, 'anotherArg', 'andAnother'],
                        [{name: 'required', required: true}],
            {
              arguments: [
                                {name: 'subRequired', required: true},
                                {name: 'subNotRequired', required: false}
              ]
            },
            false
          ]
        }

      ], (args, _arguments, subArgsOptions, expectedPrompt) => {
      mockArgsOptions = subArgsOptions;
      promptMissingArgs(mockEnv, args, _arguments, wrappedGeneratorName, this.prompt);
      if (expectedPrompt) {
        var promptCall = this.prompt.mock.calls[0];
        var promptCallArgument = promptCall[0];
        expect(expectedPrompt).allObjectsContaining(promptCallArgument);
      } else {
        expect(this.prompt).not.toHaveBeenCalled();
      }
    });
  });
  describe('should return', () => {
    it('passed arguments except required when not prompting', done => {
      mockArgsOptions = {
        arguments: [
                  {name: 'subRequired', required: true},
                  {name: 'subNotRequired', required: false}
        ]
      };
      var args = [wrappedGeneratorName, 'anotherArg', 'andAnother'];
      var _arguments = [{name: 'required', required: true}];
      promptMissingArgs(mockEnv, args, _arguments, wrappedGeneratorName, this.prompt).then(res => {
        expect(res).toEqual(['anotherArg', 'andAnother']);
        done();
      });
    });
    it('answers from the prompt when prompting', done => {
      mockArgsOptions = {
        arguments: [
                {name: 'subRequired', required: true},
                {name: 'subRequired2', required: true},
                {name: 'subNotRequired', required: false}
        ]
      };
      var args = [wrappedGeneratorName];
      var _arguments = [{name: 'required', required: true}];
      var prompt = function () {
        return Promise.resolve({
          subRequired: 'subRequiredFromPrompt',
          subRequired2: 'subRequired2FromPrompt'
        });
      };
      promptMissingArgs(mockEnv, args, _arguments, wrappedGeneratorName, prompt).then(res => {
        expect(res).toEqual(['subRequiredFromPrompt', 'subRequired2FromPrompt']);
        done();
      });
    });
  });
});

