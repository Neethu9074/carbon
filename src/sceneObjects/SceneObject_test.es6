/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three';
import _ from 'lodash';
import {expect} from 'chai';
import SceneObject from './SceneObject';

describe('3D map', () => {

  let obj;
  beforeEach(() => {
    obj = new SceneObject({pos: new THREE.Vector3(1, 2, 3)});
  });

  describe('SceneObject', () => {

    it('can be created', () => {
      expect(obj.position.x).to.equal(1);
      expect(obj.position.y).to.equal(2);
      expect(obj.position.z).to.equal(3);
    });

    it('can change position', () => {
      obj.setPosition(3, 2, 1);
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

    function matches(pair, handled) {
      return _.find(handled, pair2 =>
        (pair[0][0] === pair2[0][0] &&
        pair[0][1] === pair2[0][1] &&
        pair[0][2] === pair2[0][2])
      );
    }

    describe('states', () => {

      it('should contain unique pairs', () => {
        const handled = [];
        for (let i = 0; i < obj.stateLookUpTable.lut.length; i++) {
          const pair = obj.stateLookUpTable.lut[i];
          const match = matches(pair, handled);
          handled.push(pair);
          expect(match).to.equal(undefined);
        }
      });

    });

  });

});
