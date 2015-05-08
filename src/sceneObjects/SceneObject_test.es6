/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three';
import {expect} from 'chai';
import SceneObject from './SceneObject';

describe('3D map', () => {
  const obj = new SceneObject({pos: new THREE.Vector3(1, 2, 3)});

  describe('SceneObject', () => {
    it('can be created', () => {
      expect(obj.position.x).to.equal(1);
      expect(obj.position.y).to.equal(2);
      expect(obj.position.z).to.equal(3);
    });

    it('can change position', () => {
      obj.setPosition(new THREE.Vector3(3, 2, 1));
      expect(obj.position.x).to.equal(3);
      expect(obj.position.y).to.equal(2);
      expect(obj.position.z).to.equal(1);
    });

    it('can be disposed', () => {
      obj.dispose();
      expect(obj.position).to.equal(null);
      expect(obj.parent).to.equal(null);
      expect(obj.subscriptions.length).to.equal(0);
    });
  });
});
