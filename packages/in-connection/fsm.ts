/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

interface TransitionManager {
  transitionTo(stateName: string): void;
  getActiveState(): string;
}

export class AbstractState {
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

export type Listener<T> = (data: T) => void;

export interface SubscribeOptions {
  // {
  //   subscriptionId,
  //   event,
  //   payload,
  //   disposeSubscriptionOnDocumentHidden,
  //   listener,
  //   initializationCallStack
  // }
}

export interface PublicConnectionApi {
  init(): void;
  subscribe(options: SubscribeOptions): void;
  unsubscribe(subscriptionId: number): void;
  getNewSubscriptionId(): number;
  on<T>(event: string, fn: Listener<T>): void;
  off<T>(event: string, fn: Listener<T>): void;
  send(event: string, data: any): void;
}

export interface CreateFsmOptions {
  publicApiMethods: string[];
  initialState: string;
  states: {
    [stateName: string]: AbstractState & PublicConnectionApi;
  };
}

export function createFsm(opts: CreateFsmOptions): PublicConnectionApi {
  const transitionManager: TransitionManager = {
    transitionTo,
    getActiveState
  };

  const states = opts.states;
  let activeStateName: string;
  Object.keys(states).forEach(stateName => {
    states[stateName]._setTransitionManager(transitionManager);
  });
  transitionTo(opts.initialState);

  return {
    init() {
      states[activeStateName].init();
    },

    subscribe(options: SubscribeOptions) {
      states[activeStateName].subscribe(options);
    },

    unsubscribe(subscriptionId: number) {
      states[activeStateName].unsubscribe(subscriptionId);
    },

    getNewSubscriptionId() {
      return states[activeStateName].getNewSubscriptionId();
    },

    on<T>(event: string, fn: Listener<T>): void {
      states[activeStateName].on(event, fn);
    },

    off<T>(event: string, fn: Listener<T>): void {
      states[activeStateName].off(event, fn);
    },

    send(event: string, data: any) {
      states[activeStateName].send(event, data);
    }
  };

  function transitionTo(name: string) {
    if (activeStateName) {
      states[activeStateName].onLeave();
    }

    activeStateName = name;
    states[activeStateName].onEnter();
  }

  function getActiveState() {
    return activeStateName;
  }
}
