/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { TransitionManager } from 'in-connection/types';

export default class AbstractFsmState {
  // @ts-expect-error We have no constructor and need to support runtime configuration without
  // a runtime performance impact.
  _transitionManager: TransitionManager;

  _setTransitionManager(transitionManager: TransitionManager) {
    this._transitionManager = transitionManager;
  }

  transitionTo(stateName: string) {
    this._transitionManager.transitionTo(stateName);
  }

  getActiveState() {
    return this._transitionManager.getActiveState();
  }

  onEnter() {}
  onLeave() {}
}
