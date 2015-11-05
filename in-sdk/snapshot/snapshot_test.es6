/* eslint-env mocha, node*/
import {expect} from 'chai';
import Immutable from 'immutable';
import proxyquire from 'proxyquire';

const steadyId = 's1';
const pluginId = 'os';

describe('snapshot', () => {

  let mod;
  let snapshot;

  beforeEach(() => {
    // reimporting via proxyquire to avoid the finder cache
    mod = proxyquire('./snapshot', {});

    snapshot = Immutable.fromJS({
      steadyId,
      pluginId,
      data: {}
    });
  });

  describe('labels', () => {

    it('should retrieve the label via a finder', () => {
      const truck = 'truck';
      mod.addLabelFinder(pluginId, () => truck);
      expect(mod.getLabel(snapshot)).to.equal(truck);
    });

    it('should fall back to a configurable label', () => {
      expect(mod.getLabel(snapshot, 'whoop')).to.equal('whoop');
    });

    it('should fall back to a steady id if all else fails', () => {
      expect(mod.getLabel(snapshot)).to.equal(steadyId);
    });
  });

  describe('icons', () => {

    it('should retrieve the icon via a finder', () => {
      const truck = 'truck';
      mod.addIconFinder(pluginId, () => truck);
      expect(mod.getIcon(snapshot)).to.equal(truck);
    });

    it('should support multiple finders', () => {
      const truck = 'truck';
      mod.addIconFinder('ec2', () => 'amazon');
      mod.addIconFinder(pluginId, () => truck);
      mod.addIconFinder('docker', () => 'container');
      expect(mod.getIcon(snapshot)).to.equal(truck);
    });

    it('should allow pluginId to be specified as string as param', () => {
      const truck = 'truck';
      mod.addIconFinder(pluginId, () => truck);
      expect(mod.getIcon(pluginId)).to.equal(truck);
    });
  });

  describe('ips', () => {

    it('should retrieve ips via a finder', () => {
      const truck = 'truck';
      mod.addIpFinder(pluginId, () => truck);
      expect(mod.getIps(snapshot)).to.equal(truck);
    });
  });

});
