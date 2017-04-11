var jestExtensions = require('../modules_for_tests/jestExtensions');
var pits = jestExtensions.pits;
var pit = jestExtensions.pit;
var fpit = jestExtensions.fpit;
var xpit = jestExtensions.xpit;
var its = jestExtensions.its;

describe('without parameterization', () => {
  it('should still work', () => {
    expect(1 + 2).toBe(3);
  });
  it('should still work', () => {
    expect(3 + 0).toBe(3);
  });
});

// Its usage
var itsCallback = jest.fn((a, b) => {
  expect(a + b).toBe(3);
});
describe('its', () => {
  its([
    {
      description: 'its1',
      arguments: [1, 2]
    },
    {
      description: 'its1',
      arguments: [3, 0]
    }],
      itsCallback
    );
  describe('helper', () => {
    it('should result in multiple it calls', () => {
      expect(itsCallback).toHaveBeenCalledTimes(2);
      expect(itsCallback.mock.calls[0]).toEqual([1, 2]);
      expect(itsCallback.mock.calls[1]).toEqual([3, 0]);
    });
  });
});

describe('its', () => {
  var thisValueInCallback;
  beforeEach(() => {
    this.thisValue = 'thisValue';
  });
  its([{description: 'it', arguments: []}], () => {
    thisValueInCallback = this.thisValue;
  });
  describe('callback', () => {
    it('has access to this', () => {
      expect(thisValueInCallback).toBe('thisValue');
    });
  });
});

// Pits usage
var pitsCallback = jest.fn((a, b) => {
  expect(a + b).toBe(3);
});
describe('pits', () => {
  pit('it1', 1, 2);
  pit('it2', 3, 0);

  // If beforeEach then this will be defined
  pits(pitsCallback);
  describe('helper', () => {
    it('should result in multiple it calls', () => {
      expect(pitsCallback).toHaveBeenCalledTimes(2);
      expect(pitsCallback.mock.calls[0]).toEqual([1, 2]);
      expect(pitsCallback.mock.calls[1]).toEqual([3, 0]);
    });
  });
}
 );

describe('pits', () => {
  var thisValueInCallback;
  beforeEach(() => {
    this.thisValue = 'thisValue';
  });
  pit('pit');
  pits(() => {
    thisValueInCallback = this.thisValue;
  });
  describe('callback', () => {
    it('has access to this', () => {
      expect(thisValueInCallback).toBe('thisValue');
    });
  });
});

describe('do pits interfere', () => {
  var level1PitCallback = jest.fn();
  var level2PitCallback = jest.fn();
  var nestedPitCallback = jest.fn();
  var nestedLevel1PitCallback = jest.fn();
  var nestedLevel2PitCallback = jest.fn();

  describe('level1 1', () => {
    pit('level1:1', 1, 2);
    pit('level1:2', 3, 4);
    pits(level1PitCallback);
  });
  describe('level1 2', () => {
    pit('level2:1', 5, 6);
    pit('level2:2', 7, 8);
    pits(level2PitCallback);
  });
  describe('nested', () => {
    pit('top:1', 9, 10);
    pit('top:2', 11, 12);
    pits(nestedPitCallback);
    describe('nestedLevel1', () => {
      pit('nested:1', 13, 14);
      pit('nested:2', 15, 16);
      pits(nestedLevel1PitCallback);
      describe('nestedLevel2', () => {
        pit('nested2:1', 17, 18);
        pit('nested2:2', 19, 20);
        pits(nestedLevel2PitCallback);
      });
    });
    describe('pits', () => {
      it('should be called as expected', () => {
        expect(level1PitCallback).toHaveBeenCalledTimes(2);
        expect(level1PitCallback.mock.calls[0]).toEqual([1, 2]);
        expect(level1PitCallback.mock.calls[1]).toEqual([3, 4]);

        expect(level2PitCallback).toHaveBeenCalledTimes(2);
        expect(level2PitCallback.mock.calls[0]).toEqual([5, 6]);
        expect(level2PitCallback.mock.calls[1]).toEqual([7, 8]);

        expect(nestedPitCallback).toHaveBeenCalledTimes(2);
        expect(nestedPitCallback.mock.calls[0]).toEqual([9, 10]);
        expect(nestedPitCallback.mock.calls[1]).toEqual([11, 12]);

        expect(nestedLevel1PitCallback).toHaveBeenCalledTimes(2);
        expect(nestedLevel1PitCallback.mock.calls[0]).toEqual([13, 14]);
        expect(nestedLevel1PitCallback.mock.calls[1]).toEqual([15, 16]);

        expect(nestedLevel2PitCallback).toHaveBeenCalledTimes(2);
        expect(nestedLevel2PitCallback.mock.calls[0]).toEqual([17, 18]);
        expect(nestedLevel2PitCallback.mock.calls[1]).toEqual([19, 20]);
      });
    });
  });
});

describe('focused pits', () => {
  describe('when present', () => {
    var itCallback = jest.fn();
    pit('not focused', 'not focused');
    fpit('focused', 'focused');

    pits(itCallback);
    describe('should be', function () {
      it('the only pits run', function () {
        expect(itCallback).toHaveBeenCalledTimes(1);
        expect(itCallback.mock.calls[0][0]).toBe('focused');
      });
    });
  });
  describe('when not present', () => {
    var itCallback = jest.fn();
    pit('not focused', 'not focused');
    pits(itCallback);
    describe('should not', () => {
      it('affect non focused pits run', () => {
        expect(itCallback).toHaveBeenCalled();
      });
    });
  });
});

describe('ignored pits', () => {
  pit('not ignored', 'not ignored');
  xpit('ignored', 'ignored');
  var mockCallback = jest.fn();
  pits(mockCallback);
  describe('when present', () => {
    it('should not be run', () => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback.mock.calls[0][0]).toBe('not ignored');
    });
  });
});
