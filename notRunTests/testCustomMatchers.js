/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "xpit|xpits" }] */
var jestExtensions = require('../modules_for_tests/jestExtensions');
var pits = jestExtensions.pits;
var pit = jestExtensions.pit;
var xpit = jestExtensions.xpit;
var xpits = jestExtensions.xpits;
var matchers = jestExtensions.matchers;
var allObjectsContaining = matchers.allObjectsContaining;

describe('allObjectsContaining', () => {
  describe('should fail when', () => {
    pit('received is undefined', undefined, [], allObjectsContaining.undefinedReceived);
    pit('received is null', null, [], allObjectsContaining.nullReceived);
    pit('argument is null', [], null, allObjectsContaining.nullArgument);
    pit('argument is undefined', [], undefined, allObjectsContaining.undefinedArgument);
    pit('received is not an array', 1, [], allObjectsContaining.nonReceivedArray);
    pit('argument is not an array', [], 1, allObjectsContaining.nonArgumentArray);
    pit('arrays are different length', [], [{}], allObjectsContaining.arraysDifferentLength);
    pit('received array does not contain object', [1], [{}], null);
    pit('corresponding argument element does not have property', [{missingOnArgumentElement: 'Value'}], [{}], allObjectsContaining.elementDoesNotContain(0));
    pit('corresponding argument element has different value for a property', [{differentValueOnArgumentElement: 'Value'}], {differentValueOnArgumentElement: 'Different'}, null);
    pits((received, argument, failMessage) => {
      var returnValue = allObjectsContaining(received, argument);
      expect(returnValue.pass).toBe(false);
      if (failMessage) {
        expect(returnValue.message()).toBe(failMessage);
      }
    });
  });
  describe('should pass when', () => {
    pit('received array element is object with no properties and argument array element is anything', [{}], [1]);
    pit('corresponding argument element has all properties in received with the same value ( and additional )', [{prop1: 'Value'}], [{prop1: 'Value', prop2: 'Other value'}]);
    pits((received, argument) => {
      var returnValue = allObjectsContaining(received, argument);
      expect(returnValue.pass).toBe(true);
    });
  });
});
