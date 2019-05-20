export default class Subscriber {
  constructor() {
    this.subscriptions = [];
  }

  addSubscription(subscription) {
    this.subscriptions.push(subscription);
  }

  addSubscriptions(subscriptions) {
    subscriptions.forEach(subscription => this.addSubscription(subscription));
  }

  disposeSubscriptions() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = [];
  }

  dispose() {
    this.disposeSubscriptions();
  }
}
