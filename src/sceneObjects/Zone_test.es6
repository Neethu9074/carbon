/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three';
import {expect} from 'chai';
import Zone from './Zone';


describe('3D map', () => {
  const parent = {
    addSceneObject() {},
    removeSceneObject() {},
    removeChild() {}
  };
  let zone = new Zone({parent, id: 'id', zoneIndex: 1});

  describe('Zone', () => {
    it('can be created', () => {
      expect(zone.id).to.equal('id');
    });
    it('can be disposed', () => {
      zone.dispose();
      expect(zone.id).to.equal(null);
      expect(zone.hosts.length).to.equal(0);
      expect(zone.zoneIndex).to.equal(null);
      expect(zone.parent).to.equal(null);
    });
  });
});
