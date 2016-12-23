/* eslint-env mocha, node*/
import {expect} from 'chai';
import Immutable from 'immutable';
import proxyquire from 'proxyquire';

const UNKNOWN_LABEL = 'Unknown';
const steadyId = 's1';
const plugin = 'host';

describe('in-sdk/snapshot/legacy', () => {

  let mod;
  let snapshot;

  beforeEach(() => {
    // reimporting via proxyquire to avoid the finder cache
    mod = proxyquire('./legacy', {});

    snapshot = Immutable.fromJS({
      id: steadyId,
      steadyId,
      plugin,
      data: {}
    });
  });

  describe('labels', () => {

    it('should retrieve the label via a finder', () => {
      const truck = 'truck';
      mod.addLabelFinder(plugin, () => truck);
      expect(mod.getLabel(snapshot)).to.equal(truck);
    });

    it('should fall back to a configurable label', () => {
      expect(mod.getLabel(snapshot, 'whoop')).to.equal('whoop');
    });

    it('should fall back to a steady id if all else fails', () => {
      expect(mod.getLabel(snapshot)).to.equal(UNKNOWN_LABEL);
    });
  });
});
