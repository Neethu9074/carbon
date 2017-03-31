import invariant from 'invariant';

const SubscriptionMixin = {
  componentWillMount() {
    this.subscriptions = [];
  },

  addSubscription(subscription) {
    invariant(typeof subscription.dispose === 'function', 'subscription must be disposable');
    this.subscriptions.push(subscription);
  },

  disposeSubscription(subscription) {
    invariant(typeof subscription.dispose === 'function', 'subscription must be disposable');

    this.subscriptions.splice(this.subscriptions.indexOf(subscription));
    subscription.dispose();
  },

  disposeSubscriptions() {
    this.subscriptions.forEach(s => s.dispose());
    this.subscriptions = [];
  },

  componentWillUnmount() {
    this.disposeSubscriptions();
  }
};

export default SubscriptionMixin;
