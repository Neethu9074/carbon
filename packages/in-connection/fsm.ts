/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TransitionManager, Connection, Listener, SubscribeOptions } from 'in-connection/types';
import AbstractFsmState from 'in-connection/states/AbstractFsmState';

export interface CreateFsmOptions {
  initialState: string;
  states: {
    [stateName: string]: AbstractFsmState & Connection;
  };
}

export function createFsm(opts: CreateFsmOptions): Connection {
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

    subscribe<T>(options: SubscribeOptions<T>) {
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
