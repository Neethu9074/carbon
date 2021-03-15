/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AbstractState from 'in-connection/states/AbstractState';

export default class ConnectedState extends AbstractState {
  onEnter() {
    if (window.document.hidden) {
      this.transitionTo('windowHidden');
      return;
    }

    this.on('close', this.onClose);
    window.document.addEventListener('visibilitychange', this.onVisibilityChange, false);
    this.sharedState.subscriptions.forEach(this.sendSubscribeWhenNecessary, this);
  }

  onLeave() {
    this.off('close', this.onClose);
    window.document.removeEventListener('visibilitychange', this.onVisibilityChange, false);
  }

  onClose = () => this.transitionTo('connectionLost');

  onVisibilityChange = () => {
    if (window.document.hidden) {
      this.transitionTo('windowHidden');
    }
  };
}
