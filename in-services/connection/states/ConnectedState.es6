import AbstractState from 'in-services/connection/states/AbstractState';

export default class ConnectedState extends AbstractState {
  onEnter() {
    this.on('close', this.onClose);
    this.sharedState.subscriptions.forEach(this.sendSubscribeWhenNecessary, this);
  }

  onLeave() {
    this.off('close', this.onClose);
  }

  onClose = () => {
    this.transitionTo('connectionLost');
  };
}
