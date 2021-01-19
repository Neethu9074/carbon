/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import AbstractState from 'in-connection/states/AbstractState';

export default class WaitForInitState extends AbstractState {
  init() {
    this.transitionTo('connectionLost');
  }

  sendSubscribeWhenNecessary() {
    // not possible in this state
  }

  sendUnsubscribeWhenNecessary() {
    // not possible in this state
  }
}
