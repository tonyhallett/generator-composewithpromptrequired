if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
function parameterizedIt(focused, callArguments) {
  var args = Array.from(callArguments);
  var description = args[0];
  if (!this.__calls) {
    this.__calls = [];
  }
  this.__calls[this.__calls.length] = {focused: focused, description: description, args: args.slice(1)};
}

function pit() {
  parameterizedIt.call(this, false, arguments);
}
function fpit() {
  parameterizedIt.call(this, true, arguments);
}

function pits(cb) {
  var calls = this.__calls;

  if (calls) {
    var focusedCalls = calls.filter(call => {
      return call.focused;
    });
    if (focusedCalls.length === 0) {
      focusedCalls = calls;
    }

    focusedCalls.forEach(call => {
      it(call.description, () => {
        cb.apply(this, call.args);
      });
    });
    this.__calls = [];
  }
}

function its(itDetails, test) {
  itDetails.forEach(itDetail => {
    it(itDetail.description, () => {
      test.apply(this, itDetail.arguments);
    });
  });
}
var allObjectsContainingErrors = {
  nullReceived: 'Received is null, should be an array',
  undefinedReceived: 'Received is undefined, should be an array',
  nullArgument: 'Argument is null, should be an array',
  undefinedArgument: 'Argument is undefined, should be an array',
  nonReceivedArray: 'Received is not an array',
  nonArgumentArray: 'Argument is not an array',
  arraysDifferentLength: 'Received and argument are not arrays of objects with the same length',
  elementDoesNotContain: function (elementIndex) {
    return 'received element at element position ' + elementIndex.toString() + 'does not contain argument at that position';
  }
};
function allObjectsContaining(received, argument) {
  if (received === null) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.nullReceived;
      }
    };
  }
  if (received === undefined) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.undefinedReceived;
      }
    };
  }
  if (argument === null) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.nullArgument;
      }
    };
  }
  if (argument === undefined) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.undefinedArgument;
      }
    };
  }
  if (!Array.isArray(received)) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.nonReceivedArray;
      }
    };
  }
  if (!Array.isArray(argument)) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.nonArgumentArray;
      }
    };
  }
  if (received.length !== argument.length) {
    return {
      pass: false,
      message: () => {
        return allObjectsContainingErrors.arraysDifferentLength;
      }
    };
  }
  var errorMessage;
  for (var i = 0; i < received.length; i++) {
    var receivedObj = received[i];
    var argumentObj = argument[i];

    try {
      var result = expect.objectContaining(receivedObj).asymmetricMatch(argumentObj);
      if (!result) {
        errorMessage = allObjectsContainingErrors.elementDoesNotContain(i);
      }
    } catch (err) {
      errorMessage = err.message;
    }
    if (errorMessage) {
      break;
    }
  }
  if (errorMessage) {
    return {
      pass: false,
      message: () => {
        return errorMessage;
      }
    };
  }
  return {
    pass: true
  };
}
for (var errorMessage in allObjectsContainingErrors) {
  if (Object.prototype.hasOwnProperty.call(allObjectsContainingErrors, errorMessage)) {
    allObjectsContaining[errorMessage] = allObjectsContainingErrors[errorMessage];
  }
}
var noop = function () { };

module.exports = {
  its: its,
  pits: pits,
  xpits: noop,
  pit: pit,
  fpit: fpit,
  xpit: noop,
  xbeforeAll: noop,
  xafterAll: noop,
  matchers: {
    allObjectsContaining: allObjectsContaining
  }
};
