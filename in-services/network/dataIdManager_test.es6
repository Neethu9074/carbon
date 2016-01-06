/* eslint-env mocha */

import {expect} from 'chai';

import {getNewDataId} from './dataIdManager';

describe('in-services.network.dataIdManager', () => {
  it('should return data IDS', () => {
    expect(getNewDataId()).to.be.a('number');
  });

  it('should be monotonically increasing', () => {
    expect(getNewDataId()).to.be.lt(getNewDataId());
  });
});
