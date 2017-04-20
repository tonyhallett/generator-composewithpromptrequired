import { Questions, Answers } from "@types/inquirer";
import { ArgumentConfig } from "@types/yeoman-generator"
import wrappedGeneratorArgsAndOptions = require('./generatorArgsOptionsSniffer');


  
export = function (env: {}, args: Array<any>, _arguments: ArgumentConfig[], wrappedGeneratorName: string, prompt: (questions: Questions) => Promise<Answers>):Promise<Array<any>> {
  function getRequiredArgumentConfigs(argConfigs: ArgumentConfig[]): ArgumentConfig[]{
    return argConfigs.filter(argConfig => argConfig.required);
  }
  function getWrappedArguments() :Array<any>{
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


