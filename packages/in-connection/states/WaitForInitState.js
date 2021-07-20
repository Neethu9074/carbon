/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import AbstractConnectionState from 'in-connection/states/AbstractConnectionState';

export default class WaitForInitState extends AbstractConnectionState {
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
