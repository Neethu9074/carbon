import AbstractState from 'in-services/connection/states/AbstractState';

export default class WindowHiddenLongTimeState extends AbstractState {
  onEnter() {
    if (!window.document.hidden) {
      this.transitionTo('connected');
      return;
    }

    this.on('close', this.onClose);
    window.document.addEventListener('visibilitychange', this.onVisibilityChange, false);

    this.sharedState.subscriptions.forEach(subscriptionDescription => {
      if (subscriptionDescription.disposeSubscriptionOnDocumentHidden) {
        this.sendUnsubscribeWhenNecessary(subscriptionDescription);
      }
    });
  }

  onLeave() {
    this.off('close', this.onClose);
    window.document.removeEventListener('visibilitychange', this.onVisibilityChange, false);
  }

  sendSubscribeWhenNecessary(subscriptionDescription) {
    if (!subscriptionDescription.disposeSubscriptionOnDocumentHidden) {
      super.sendSubscribeWhenNecessary(subscriptionDescription);
    }
  }

  onClose = () => {
    this.transitionTo('connectionLost');
  };

  onVisibilityChange = () => {
    if (!window.document.hidden) {
      this.transitionTo('connected');
    }
  };
}
