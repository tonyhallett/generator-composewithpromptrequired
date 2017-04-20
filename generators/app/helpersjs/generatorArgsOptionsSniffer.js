function getGeneratorArgsAndOptions(env, wrappedGeneratorName) {
  var generator;
  var options = {help: true};
  var args;
  try {
    var Generator = require(wrappedGeneratorName); // eslint-disable-line import/no-dynamic-require
    Generator.resolved = require.resolve(wrappedGeneratorName);
    Generator.namespace = env.namespace(wrappedGeneratorName);
    generator = env.instantiate(Generator, {
      options: options,
      arguments: args
    });
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      generator = env.create(wrappedGeneratorName, {
        options: options,
        arguments: args
      });
    } else {
      throw err;
    }
  }
  return {options: generator._options, arguments: generator._arguments};
}
module.exports = getGeneratorArgsAndOptions;
