/* eslint max-params: ["error", 5] */
var wrappedGeneratorArgsAndOptions = require('./generatorArgsOptionsSniffer');

module.exports = function (env, args, _arguments, wrappedGeneratorName, prompt) {
  function getRequiredArgumentConfigs(argConfigs) {
    return argConfigs.filter(argConfig => argConfig.required);
  }
  function getWrappedArguments() {
    var requiredArgConfigs = getRequiredArgumentConfigs(_arguments);
    return args.slice(requiredArgConfigs.length);
  }

  var wrappedArgsAndOptions = wrappedGeneratorArgsAndOptions(env, wrappedGeneratorName);
  var wrappedArgs = wrappedArgsAndOptions.arguments;
  var requiredWrappedArgs = getRequiredArgumentConfigs(wrappedArgs);
  var argsForWrapped = getWrappedArguments();
  if (argsForWrapped.length < requiredWrappedArgs.length) {
    var questions = requiredWrappedArgs.map(genArgConfig => {
      return {
        name: genArgConfig.name,
        type: 'input',
        message: 'Please provide required argument: ' + genArgConfig.name
      };
    });
    return prompt(questions).then(answers => {
      var answersArray = [];
      for (var key in answers) {
        if (Object.prototype.hasOwnProperty.call(answers, key)) {
          answersArray.push(answers[key]);
        }
      }
      return answersArray;
    });
  }
  return Promise.resolve(argsForWrapped);
};
