/* eslint-env mocha, node */
import {expect} from 'chai';

import {getPartsForCount} from 'in-map/src/3DSceneObjects/process/dashedLineHelper';


describe('dashed line helper', () => {
  it('should return a straigt line', () => {
    const parts = getPartsForCount(1);
    expect(parts).to.deep.equal([0, 1]);
  });

  it('should ', () => {
    const parts = getPartsForCount(2);
    expect(parts).to.deep.equal([0, 0.25, 0.5, 1]);
  });

  it('the last part should always go to 1', () => {
    const parts = getPartsForCount(10);
    expect(parts[parts.length - 1]).to.equal(1);
  });
});
