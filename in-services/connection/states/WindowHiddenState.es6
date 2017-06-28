import AbstractState from 'in-services/connection/states/AbstractState';

export default class WindowHiddenState extends AbstractState {
  onEnter() {
    if (!window.document.hidden) {
      this.transitionTo('connected');
      return;
    }

    this.on('close', this.onClose);
    window.document.addEventListener('visibilitychange', this.onVisibilityChange, false);
    this.timerHandle = setTimeout(this.onHiddenForLongTime, this.sharedState.timeUntilDisposingSubscriptionsForHiddenUi);
  }

  onLeave() {
    this.off('close', this.onClose);
    window.document.removeEventListener('visibilitychange', this.onVisibilityChange, false);
    clearTimeout(this.timerHandle);
  }

  sendSubscribeWhenNecessary(subscriptionDescription) {
    if (!subscriptionDescription.disposeSubscriptionOnDocumentHidden) {
      super.sendSubscribeWhenNecessary(subscriptionDescription);
    }
  }

  onClose = () => {
    this.transitionTo('connectionLost');
  }

  onVisibilityChange = () => {
    if (!window.document.hidden) {
      this.transitionTo('connected');
    }
  }

  onHiddenForLongTime = () => {
    this.transitionTo('windowHiddenLongTime');
  }
}
