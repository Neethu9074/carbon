/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import Immutable from 'immutable';
import {extractId, isIdEqual} from './snapshots';

describe('util.snapshots', () => {

  describe('extractId', () => {
    it('should extract IDs', () => {
      const id = extractId(newSnapshot(1));
      expect(id.get('pluginId')).to.equal('p1');
      expect(id.get('steadyId')).to.equal('s1');
      expect(id.get('hostId')).to.equal('h1');
    });
  });

  describe('isIdEqual', () => {
    it('should return false when IDs do not match', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(1))).to.equal(false);
    });

    it('should return true when ID matches', () => {
      expect(isIdEqual(newSnapshot(0), newSnapshot(0))).to.equal(true);
    });
  });

  function newSnapshot(n) {
    return Immutable.fromJS({
      pluginId: 'p' + n,
      steadyId: 's' + n,
      hostId: 'h' + n
    });
  }
});
