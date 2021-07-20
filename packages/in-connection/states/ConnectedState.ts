/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AbstractConnectionState from 'in-connection/states/AbstractConnectionState';

export default class ConnectedState extends AbstractConnectionState {
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
