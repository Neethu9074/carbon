/* eslint-env mocha */
/* eslint-disable no-unused-vars, new-cap, max-len */
import {expect} from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

import {resetStoreRegistry} from 'in-stores/store';

describe('stores.timeline', () => {

  let onNext;
  let timelineStore;

  beforeEach(() => {
    onNext = sinon.stub();
    resetStoreRegistry();
    timelineStore = proxyquire('./timeline', {});
  });

  it('should return default value', () => {
    timelineStore.currentRollup.subscribe(onNext);

    expect(onNext).to.have.been.callCount(1);
    expect(onNext.getCall(0).args[0]).to.equal('1 sec');
  });

  it('should return 1 sec for timeframe: 10 minutes', () => {
    timelineStore.currentRollup.subscribe(onNext);

    timelineStore.setTimeframe(1000 * 60 * 10);
    expect(onNext).to.have.been.callCount(2);
    expect(onNext.getCall(1).args[0]).to.equal('1 sec');
  });

  it('should return 5 sec for timeframe: 1 hour', () => {
    timelineStore.currentRollup.subscribe(onNext);

    timelineStore.setTimeframe(1000 * 60 * 60);
    expect(onNext).to.have.been.callCount(2);
    expect(onNext.getCall(1).args[0]).to.equal('5 sec');
  });

  it('should return 1 min for timeframe: 12 hour', () => {
    timelineStore.currentRollup.subscribe(onNext);

    timelineStore.setTimeframe(1000 * 60 * 60 * 12);
    expect(onNext).to.have.been.callCount(2);
    expect(onNext.getCall(1).args[0]).to.equal('1 min');
  });

  it('should return 2 min for timeframe: 24 hour', () => {
    timelineStore.currentRollup.subscribe(onNext);

    timelineStore.setTimeframe(1000 * 60 * 60 * 24);
    expect(onNext).to.have.been.callCount(2);
    expect(onNext.getCall(1).args[0]).to.equal('2 min');
  });

});
