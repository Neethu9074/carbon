import AbstractState from 'in-services/connection/states/AbstractState';

export default class ConnectedState extends AbstractState {
  onEnter() {
    this.on('close', this.onClose);
    this.sharedState.subscriptions.forEach(this.sendSubscribeWhenNecessary, this);

    if (window.document.hidden) {
      this.transitionTo('windowHidden');
    } else {
      window.document.addEventListener('visibilitychange', this.onVisibilityChange, false);
    }
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
