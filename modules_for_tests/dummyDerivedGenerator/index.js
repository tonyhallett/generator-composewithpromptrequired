var baseGenerator = require('../../generators/app');

module.exports = class extends baseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.option('derivedOption', {default: 'derivedOption'});
  }
  initializing() {
    this.initializingBase();
  }

  // Must have a run loop method or exception
  end() { }
};
