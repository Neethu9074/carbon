/* eslint-env mocha */

import {expect} from 'chai';

import {getNewSubscriptionId} from './subscriptionManager';

describe('in-services.network.subscriptionManager', () => {
  it('should return subscription IDS', () => {
    expect(getNewSubscriptionId()).to.be.a('number');
  });

  it('should be monotonically increasing', () => {
    expect(getNewSubscriptionId()).to.be.lt(getNewSubscriptionId());
  });
});
