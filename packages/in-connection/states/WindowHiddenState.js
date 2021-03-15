/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AbstractState from 'in-connection/states/AbstractState';

export default class WindowHiddenState extends AbstractState {
  onEnter() {
    if (!window.document.hidden) {
      this.transitionTo('connected');
      return;
    }

    this.on('close', this.onClose);
    window.document.addEventListener('visibilitychange', this.onVisibilityChange, false);
    this.timerHandle = setTimeout(
      this.onHiddenForLongTime,
      this.sharedState.timeUntilDisposingSubscriptionsForHiddenUi
    );
  }

  onLeave() {
    this.off('close', this.onClose);
    window.document.removeEventListener('visibilitychange', this.onVisibilityChange, false);
    clearTimeout(this.timerHandle);
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

  onHiddenForLongTime = () => {
    this.transitionTo('windowHiddenLongTime');
  };
}
