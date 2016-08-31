/* eslint-env mocha,node */
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import sinon from 'sinon';


describe('layoutingStorage', () => {
  let maxPowerSubscription;
  let maxPowerCallback;

  const powerStore = proxyquire('in-map/stores/physical/powerStore', {
    'in-map/misc/TimingConfig': {
      POWER_CHECKING: 0
    }
  });

  beforeEach(() => {
    maxPowerCallback = sinon.stub();
    maxPowerSubscription = powerStore.maxPower$.subscribe(maxPowerCallback);
  });

  afterEach(() => {
    maxPowerSubscription.dispose();
  });

  it('should have no call since there is no callback', () => {
    expect(maxPowerCallback).to.have.callCount(0);
  });

  it('should increase power according to inserted powers', () => {
    expect(maxPowerCallback).to.have.callCount(0);

    powerStore.powers.add('id1', 1);
    expect(maxPowerCallback).to.have.callCount(1);
    expect(maxPowerCallback.getCall(0).args[0]).to.equal(1);

    powerStore.powers.add('id2', 3);
    expect(maxPowerCallback).to.have.callCount(2);
    expect(maxPowerCallback.getCall(1).args[0]).to.equal(3);

    powerStore.powers.add('id3', 2);
    expect(maxPowerCallback).to.have.callCount(3);
    expect(maxPowerCallback.getCall(2).args[0]).to.equal(3);

    powerStore.powers.add('id1', 4);
    expect(maxPowerCallback).to.have.callCount(4);
    expect(maxPowerCallback.getCall(3).args[0]).to.equal(4);

    powerStore.powers.remove('id1');
    powerStore.powers.remove('id2');
    powerStore.powers.remove('id3');
    powerStore.powers.remove('id4');
  });

  it('should decrease power when removing ids', () => {
    expect(maxPowerCallback).to.have.callCount(1);

    powerStore.powers.add('id1', 1);
    expect(maxPowerCallback).to.have.callCount(2);
    expect(maxPowerCallback.getCall(1).args[0]).to.equal(1);

    powerStore.powers.add('id2', 3);
    expect(maxPowerCallback).to.have.callCount(3);
    expect(maxPowerCallback.getCall(2).args[0]).to.equal(3);

    powerStore.powers.remove('id2');
    expect(maxPowerCallback).to.have.callCount(4);
    expect(maxPowerCallback.getCall(3).args[0]).to.equal(1);

    powerStore.powers.remove('id1');
    expect(maxPowerCallback).to.have.callCount(5);
    expect(maxPowerCallback.getCall(4).args[0]).to.equal(0);
  });
});
