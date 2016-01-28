const emptyArray = [];

export default class BaseSubscriber {

  constructor() {
    this.subscriptions = [];
  }

  addSubscription(subscription) {
    this.subscriptions.push(subscription);
  }

  addSubscriptions(subscriptions) {
    subscriptions.forEach(subscription => this.addSubscription(subscription));
  }

  dispose() {
    this.subscriptions.forEach(subscription => subscription.dispose());
    this.subscriptions = emptyArray;
  }
}
