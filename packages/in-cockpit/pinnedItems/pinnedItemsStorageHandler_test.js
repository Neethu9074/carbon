/* eslint-env mocha */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { stub } from 'sinon';

import { types } from 'in-cockpit/pinnedItems/pinnedItems';

describe('in-cockpit/pinnedItems/pinnedItemsStorageHandler', () => {
  let callback;
  let subscription;
  let module;

  beforeEach(() => {
    const tempStorage = {};
    const tempSettings = create();
    module = proxyquire('in-cockpit/pinnedItems/pinnedItemsStorageHandler', {
      'in-services/settings/settings': {
        settings$: tempSettings.startWith(tempStorage),
        setSingle: (k, v) => {
          tempStorage[k] = v;
          tempSettings.emit(tempStorage);
        },
        getSingle: k => tempStorage[k]
      }
    });

    callback = stub();
    subscription = module.getPinnedItems$.subscribe(callback);
  });

  afterEach(() => {
    subscription.dispose();
  });

  it('should send initial ids', () => {
    expect(callback).to.have.callCount(1);
    expect(callback.getCall(0).args[0]).to.deep.equal({});
  });

  it('should not resend when adding doubled ids', () => {
    const expectedResult = {};

    module.pin(types.APPLCATIONS, '42');
    expectedResult[types.APPLCATIONS] = ['42'];
    expect(callback).to.have.callCount(2);
    expect(callback.getCall(1).args[0]).to.deep.equal(expectedResult);

    module.pin(types.WEBSITES, '43');
    expectedResult[types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.pin(types.WEBSITES, '43');
    expectedResult[types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.pin(types.WEBSITES, '44');
    expectedResult[types.WEBSITES] = ['43', '44'];
    expect(callback).to.have.callCount(4);
    expect(callback.getCall(3).args[0]).to.deep.equal(expectedResult);
  });

  it('should resend when removing ids to types which it is subscribed for', () => {
    const expectedResult = {};

    module.pin(types.APPLCATIONS, '42');
    expectedResult[types.APPLCATIONS] = ['42'];
    expect(callback).to.have.callCount(2);
    expect(callback.getCall(1).args[0]).to.deep.equal(expectedResult);

    module.pin(types.WEBSITES, '43');
    expectedResult[types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.unpin(types.APPLCATIONS, '42');
    expectedResult[types.APPLCATIONS] = [];
    expect(callback).to.have.callCount(4);
    expect(callback.getCall(3).args[0]).to.deep.equal(expectedResult);
  });
});
