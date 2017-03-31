/* eslint-env mocha */

import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('in-services.subscriptionManager', () => {
  let persistentConnection;
  let mod;

  beforeEach(() => {
    persistentConnection = {
      on: sinon.stub(),
      emit: sinon.stub(),
      off: sinon.stub()
    };

    mod = proxyquire('./subscriptionManager', {
      'in-services/persistentConnection': persistentConnection
    });

    mod.init();
    persistentConnection.on.getCall(0).args[1]();
  });

  describe('getNewSubscriptionId', () => {
    it('should return subscription IDS', () => {
      expect(mod.getNewSubscriptionId()).to.be.a('number');
    });

    it('should be monotonically increasing', () => {
      expect(mod.getNewSubscriptionId()).to.be.lt(mod.getNewSubscriptionId());
    });
  });

  describe('subscribe', () => {
    it('should send subscription to persistent connection', () => {
      const event = 'subscribe-view';
      const payload = { a: 'foo' };
      mod.subscribe(5, event, payload);
      expect(persistentConnection.emit).to.have.been.calledWith(event, payload);
    });
  });

  describe('unsubscribe', () => {
    it('should send unsubscribe event to backend', () => {
      const subscriptionId = 5;
      mod.subscribe(subscriptionId, 'foo-bar', {});
      mod.unsubscribe(subscriptionId);
      expect(persistentConnection.emit).to.have.been.calledWith('unsubscribe', {
        subscriptionId
      });
    });
  });

  describe('reconnect', () => {
    it('should subscribe to reconnect event', () => {
      expect(persistentConnection.on).to.have.been.calledWith('reconnect');
    });

    it('should resend active subscriptions to backend', () => {
      const event = 'subscribe-view';
      const payload = { a: 'foo' };
      mod.subscribe(5, event, payload);

      // simulate reconnect
      persistentConnection.on.getCall(1).args[1]();
      persistentConnection.on.getCall(0).args[1]();

      expect(persistentConnection.emit).to.have.callCount(2);
      expect(persistentConnection.emit.getCall(1).args).to.deep.equal([event, payload]);
    });
  });
});
