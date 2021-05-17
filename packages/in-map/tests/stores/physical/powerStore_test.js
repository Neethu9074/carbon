/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest,node */
import { expect } from 'chai';
import sinon from 'sinon';
import { maxPower$, powers } from 'in-map/stores/physical/powerStore';

jest.mock('in-map/misc/TimingConfig', () => ({
  POWER_CHECKING: 0
}));

describe('layoutingStorage', () => {
  let maxPowerSubscription;
  let maxPowerCallback;

  beforeEach(() => {
    maxPowerCallback = sinon.stub();
    maxPowerSubscription = maxPower$.subscribe(maxPowerCallback);
  });

  afterEach(() => {
    maxPowerSubscription.dispose();
  });

  it('should have initial call since there is no callback', () => {
    expect(maxPowerCallback).to.have.callCount(1);
    expect(maxPowerCallback.getCall(0).args[0]).to.equal(0);
  });

  it('should increase power according to inserted powers', () => {
    expect(maxPowerCallback).to.have.callCount(1);

    powers.add('id1', 1);
    expect(maxPowerCallback).to.have.callCount(2);
    expect(maxPowerCallback.getCall(1).args[0]).to.equal(1);

    powers.add('id2', 3);
    expect(maxPowerCallback).to.have.callCount(3);
    expect(maxPowerCallback.getCall(2).args[0]).to.equal(3);

    powers.add('id3', 2);
    expect(maxPowerCallback).to.have.callCount(4);
    expect(maxPowerCallback.getCall(3).args[0]).to.equal(3);

    powers.add('id1', 4);
    expect(maxPowerCallback).to.have.callCount(5);
    expect(maxPowerCallback.getCall(4).args[0]).to.equal(4);

    powers.remove('id1');
    powers.remove('id2');
    powers.remove('id3');
    powers.remove('id4');
  });

  it('should decrease power when removing ids', () => {
    expect(maxPowerCallback).to.have.callCount(1);

    powers.add('id1', 1);
    expect(maxPowerCallback).to.have.callCount(2);
    expect(maxPowerCallback.getCall(1).args[0]).to.equal(1);

    powers.add('id2', 3);
    expect(maxPowerCallback).to.have.callCount(3);
    expect(maxPowerCallback.getCall(2).args[0]).to.equal(3);

    powers.remove('id2');
    expect(maxPowerCallback).to.have.callCount(4);
    expect(maxPowerCallback.getCall(3).args[0]).to.equal(1);

    powers.remove('id1');
    expect(maxPowerCallback).to.have.callCount(5);
    expect(maxPowerCallback.getCall(4).args[0]).to.equal(0);
  });
});
