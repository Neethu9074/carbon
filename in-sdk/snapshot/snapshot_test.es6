/* eslint-env mocha, node*/
import {expect} from 'chai';
import Immutable from 'immutable';
import proxyquire from 'proxyquire';

const steadyId = 's1';
const plugin = 'os';

describe('snapshot', () => {

  let mod;
  let snapshot;

  beforeEach(() => {
    // reimporting via proxyquire to avoid the finder cache
    mod = proxyquire('./snapshot', {});

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
      expect(mod.getLabel(snapshot)).to.equal(steadyId);
    });
  });

  describe('long labels', () => {

    it('should retrieve the label via a finder', () => {
      const truck = 'truck';
      mod.addLongLabelFinder(plugin, () => truck);
      expect(mod.getLongLabel(snapshot)).to.equal(truck);
    });

    it('should fall back to a configurable label', () => {
      expect(mod.getLongLabel(snapshot, 'whoop')).to.equal('whoop');
    });

    it('should fall back to undefined if all else fails', () => {
      expect(mod.getLongLabel(snapshot)).to.equal(undefined);
    });
  });

  describe('icons', () => {

    it('should retrieve the icon via a finder', () => {
      const truck = 'truck';
      mod.addIconFinder(plugin, () => truck);
      expect(mod.getIcon(snapshot)).to.equal(truck);
    });

    it('should support multiple finders', () => {
      const truck = 'truck';
      mod.addIconFinder('ec2', () => 'amazon');
      mod.addIconFinder(plugin, () => truck);
      mod.addIconFinder('docker', () => 'container');
      expect(mod.getIcon(snapshot)).to.equal(truck);
    });

    it('should allow plugin to be specified as string as param', () => {
      const truck = 'truck';
      mod.addIconFinder(plugin, () => truck);
      expect(mod.getIcon(plugin)).to.equal(truck);
    });

  });

});
