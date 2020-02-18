/* eslint-env mocha */
import { create } from 'reactive-observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('in-cockpit/favItems/favItems', () => {
  let callback;
  let subscription;
  let expectedResult;
  let module;

  beforeEach(() => {
    const inMemoryMap = {};

    const favItems$ = create();
    favItems$.emit(inMemoryMap);

    function set(type, id) {
      if (!inMemoryMap[type]) {
        inMemoryMap[type] = [];
      }
      if (inMemoryMap[type].indexOf(id) === -1) {
        inMemoryMap[type].push(id);
        favItems$.emit(inMemoryMap);
      }
    }

    function unset(type, id) {
      if (!inMemoryMap[type]) {
        return;
      }
      const indexOfId = inMemoryMap[type].indexOf(id);
      if (indexOfId === -1) {
        return;
      }

      inMemoryMap[type].splice(indexOfId, 1);
      favItems$.emit(inMemoryMap);
    }

    module = proxyquire('in-cockpit/favItems/favItems', {
      'in-cockpit/favItems/favItemsStorageHandler': { set, unset, favItems$ }
    });

    callback = stub();
    subscription = module.getFavItemIds([module.types.APPLCATIONS, module.types.WEBSITES]).subscribe(callback);

    expectedResult = {};
    expectedResult[module.types.APPLCATIONS] = [];
    expectedResult[module.types.WEBSITES] = [];
  });

  afterEach(() => {
    subscription.dispose();
  });

  it('should send initial ids', () => {
    expect(callback).to.have.callCount(1);
    expect(callback.getCall(0).args[0]).to.deep.equal(expectedResult);
  });

  it('should resend when adding ids to types which it is  subscribed for', () => {
    module.favoriseItem(module.types.APPLCATIONS, '42');
    expectedResult[module.types.APPLCATIONS] = ['42'];
    expect(callback).to.have.callCount(2);
    expect(callback.getCall(1).args[0]).to.deep.equal(expectedResult);

    module.favoriseItem(module.types.WEBSITES, '43');
    expectedResult[module.types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.favoriseItem(module.types.WEBSITES, '43');
    expectedResult[module.types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.favoriseItem(module.types.WEBSITES, '44');
    expectedResult[module.types.WEBSITES] = ['43', '44'];
    expect(callback).to.have.callCount(4);
    expect(callback.getCall(3).args[0]).to.deep.equal(expectedResult);
  });

  it('should resend when removing ids to types which it is  subscribed for', () => {
    module.favoriseItem(module.types.APPLCATIONS, '42');
    expectedResult[module.types.APPLCATIONS] = ['42'];
    expect(callback).to.have.callCount(2);
    expect(callback.getCall(1).args[0]).to.deep.equal(expectedResult);

    module.favoriseItem(module.types.WEBSITES, '43');
    expectedResult[module.types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.unfavoriseItem(module.types.APPLCATIONS, '42');
    expectedResult[module.types.APPLCATIONS] = [];
    expect(callback).to.have.callCount(4);
    expect(callback.getCall(3).args[0]).to.deep.equal(expectedResult);
  });
});
