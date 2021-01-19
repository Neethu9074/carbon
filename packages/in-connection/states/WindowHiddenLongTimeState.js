/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import AbstractState from 'in-connection/states/AbstractState';

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

  sendSubscribeWhenNecessary() {
    // Never establish any new subscriptions when the document is hidden.
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
