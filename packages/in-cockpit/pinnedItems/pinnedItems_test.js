/* eslint-env mocha */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('in-cockpit/pinnedItems/pinnedItems', () => {
  let callback;
  let subscription;
  let expectedResult;
  let module;

  beforeEach(() => {
    module = proxyquire('in-cockpit/pinnedItems/pinnedItems', {});
    module.clear();

    callback = stub();
    subscription = module.getPinnedItems([module.types.APPLCATIONS, module.types.WEBSITES]).subscribe(callback);

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

  it('should not resend when adding doubled ids', () => {
    module.pin(module.types.APPLCATIONS, '42');
    expectedResult[module.types.APPLCATIONS] = ['42'];
    expect(callback).to.have.callCount(2);
    expect(callback.getCall(1).args[0]).to.deep.equal(expectedResult);

    module.pin(module.types.WEBSITES, '43');
    expectedResult[module.types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.pin(module.types.WEBSITES, '43');
    expectedResult[module.types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.pin(module.types.WEBSITES, '44');
    expectedResult[module.types.WEBSITES] = ['43', '44'];
    expect(callback).to.have.callCount(4);
    expect(callback.getCall(3).args[0]).to.deep.equal(expectedResult);
  });

  it('should resend when removing ids to types which it is subscribed for', () => {
    module.pin(module.types.APPLCATIONS, '42');
    expectedResult[module.types.APPLCATIONS] = ['42'];
    expect(callback).to.have.callCount(2);
    expect(callback.getCall(1).args[0]).to.deep.equal(expectedResult);

    module.pin(module.types.WEBSITES, '43');
    expectedResult[module.types.WEBSITES] = ['43'];
    expect(callback).to.have.callCount(3);
    expect(callback.getCall(2).args[0]).to.deep.equal(expectedResult);

    module.unpin(module.types.APPLCATIONS, '42');
    expectedResult[module.types.APPLCATIONS] = [];
    expect(callback).to.have.callCount(4);
    expect(callback.getCall(3).args[0]).to.deep.equal(expectedResult);
  });
});
