/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';

import SubscriptionMixin from './SubscriptionMixin';

describe('SubscriptionMixin', () => {
  let instance;
  let subscription;

  beforeEach(() => {
    instance = Object.create(SubscriptionMixin);
    instance.componentWillMount();
    subscription = {
      dispose: sinon.stub()
    };
  });

  it('should expose methods to handle subscriptios', () => {
    expect(instance.addSubscription).to.be.a('function');
    expect(instance.disposeSubscriptions).to.be.a('function');
  });

  it('should tear down subscriptions on unmount', () => {
    instance.addSubscription(subscription);
    instance.componentWillUnmount();
    expect(subscription.dispose.called).to.equal(true);
  });

  it('should enable disposing of only one subscription', () => {
    instance.addSubscription(subscription);
    instance.disposeSubscription(subscription);
    expect(subscription.dispose.calledOnce).to.equal(true);
    instance.disposeSubscriptions();
    expect(subscription.dispose.calledOnce).to.equal(true);
  });
});
