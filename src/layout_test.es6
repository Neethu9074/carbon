/*eslint-env mocha*/

'use strict';

import {expect} from 'chai';
import {getCubePosition} from './layout';

describe('layout', () => {

  it('should calculate cube position', () => {
    const [x, y] = getCubePosition(0, 0);
    expect(x).to.equal(1);
    expect(y).to.equal(1);
  });

  it('should support multiple cubes per zone', () => {
    const [x, y] = getCubePosition(0, 1);
    expect(x).to.equal(3);
    expect(y).to.equal(1);
  });

  it('should support multiple zones', () => {
    const [x, y] = getCubePosition(1, 0);
    expect(x).to.equal(9);
    expect(y).to.equal(1);
  });

  it('should use at most three cubes horizontally', () => {
    const [x, y] = getCubePosition(0, 3);
    expect(x).to.equal(1);
    expect(y).to.equal(3);
  });

  it('should support support nine cubes', () => {
    const [x, y] = getCubePosition(0, 8);
    expect(x).to.equal(5);
    expect(y).to.equal(5);
  });

  it('should use at most four cubes in multiple zones', () => {
    const [x, y] = getCubePosition(1, 8);
    expect(x).to.equal(13);
    expect(y).to.equal(5);
  });
});
