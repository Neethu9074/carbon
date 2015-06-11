/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import THREE from 'three';
import {expect, assert} from 'chai';

import CMCM from './ColorMultiplierContentManipulator';


describe('3D map', () => {
  let contentProvider = {
    getColors() { return [0, 1, 0.5]; }
  };

  describe('ColorMultiplierContentManipulator', () => {
    it('can steam vertices', () => {
      const colorContentManipulator = new CMCM({contentProvider});
      const colors = colorContentManipulator.getColors();

      expect(colors[0]).to.equal(0);
      expect(colors[1]).to.equal(1);
      expect(colors[2]).to.equal(0.5);
    });

    it('can manipulate steamed vertices', () => {
      const colorContentManipulator = new CMCM({
        contentProvider,
        r: 0.5,
        g: 0.5,
        b: 0.5
      });

      const colors = colorContentManipulator.getColors();

      expect(colors[0]).to.equal(0);
      expect(colors[1]).to.equal(0.5);
      expect(colors[2]).to.equal(0.25);
    });
  });
});
