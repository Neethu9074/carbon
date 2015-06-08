/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import Layouter from './layout';

describe('layout', () => {

  let getCubePosition;
  let getGroupPosition;

  beforeEach(() => {
    const layouter = new Layouter();
    getCubePosition = layouter.getCubePosition.bind(layouter);
    getGroupPosition = layouter.getGroupPosition.bind(layouter);
  });

  describe('cubePosition', () => {
    it('should calculate cube position', () => {
      const {x, z} = getCubePosition(0, 0);
      expect(x).to.equal(1);
      expect(-z).to.equal(1);
    });

    it('should support multiple cubes per Group', () => {
      const {x, z} = getCubePosition(0, 1);
      expect(x).to.equal(4);
      expect(-z).to.equal(1);
    });

    it('should support multiple Groups', () => {
      const {x, z} = getCubePosition(1, 0);
      expect(x).to.equal(11);
      expect(-z).to.equal(1);
    });

    it('should use at most three cubes horizontally', () => {
      const {x, z} = getCubePosition(0, 3);
      expect(x).to.equal(1);
      expect(-z).to.equal(4);
    });

    it('should support support nine cubes', () => {
      const {x, z} = getCubePosition(0, 8);
      expect(x).to.equal(7);
      expect(-z).to.equal(7);
    });

    it('should use at most four cubes in multiple Groups', () => {
      const {x, z} = getCubePosition(1, 8);
      expect(x).to.equal(17);
      expect(-z).to.equal(7);
    });
  });

  describe('GroupPosition', () => {
    it('should support groups with only one cube', () => {
      const {x, y, width, height} = getGroupPosition(0, 1);
      expect(x).to.equal(0);
      expect(y).to.equal(0);
      expect(width).to.equal(9);
      expect(height).to.equal(3);
    });

    it('should support groups with multiple cubes', () => {
      const {x, y, width, height} = getGroupPosition(0, 4);
      expect(x).to.equal(0);
      expect(y).to.equal(0);
      expect(width).to.equal(9);
      expect(height).to.equal(6);
    });

    it('should support groups with multiple cubes', () => {
      const {x, y, width, height} = getGroupPosition(1, 4);
      expect(x).to.equal(10);
      expect(y).to.equal(0);
      expect(width).to.equal(9);
      expect(height).to.equal(6);
    });
  });
});
