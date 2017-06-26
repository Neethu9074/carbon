import { createLogger } from 'instalog';

import { AbstractState } from 'in-services/fsm';

const logger = createLogger('connection/states/AbstractState');

export default class AbstractConnectionState extends AbstractState {
  constructor(sharedState) {
    super();
    this.sharedState = sharedState;
  }

  on(event, fn) {
    this.sharedState.events.on(event, fn);
  }

  off(event, fn) {
    this.sharedState.events.off(event, fn);
  }

  init() {
    logger.debug(`init() not supported in state: ${this.getActiveState()}`);
  }

  subscribe() {
    logger.debug(`subscribe() not supported in current state: ${this.getActiveState()}`);
  }

  sendSubscribeWhenNecessary() {
    logger.debug(`sendSubscribeWhenNecessary() not supported in state: ${this.getActiveState()}`);
  }

  unsubscribe() {
    logger.debug(`unsubscribe() not supported in state: ${this.getActiveState()}`);
  }

  sendUnsubscribeWhenNecessary() {
    logger.debug(`sendUnsubscribeWhenNecessary() not supported in state: ${this.getActiveState()}`);
  }

  getNewSubscriptionId() {
    return this.sharedState.subscriptionIdCounter++;
  }

  send(event, obj) {
    this.sharedState.metrics.transmitted++;
    this.sharedState.socket.send(`${event},${JSON.stringify(obj)}`);
  }
}
