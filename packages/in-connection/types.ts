/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import EventEmitter from 'eventemitter3';

export interface SharedState {
  socket?: WebSocket;
  events: EventEmitter;

  // We want to reduce the overhead of channels on the network. Example: A metric
  // subscription would need to include the hostId, plugin, steadyId, metric
  // name and possibly other pieces of information in order to route messages.
  // This is way too much overhead. We want to route messages based on a single
  // numeric value. This is what these IDs are for. We include a single ID in
  // server responses to reduce the overhead.
  subscriptionIdCounter: number;

  metrics: {
    received: number;
    transmitted: number;
    connectionAttempts: number;
  };

  // {
  //   <id>: {
  //     subscriptionId
  //     event: 'event to send to establish subscription'
  //     payload: 'payload to be send to establish subscription'
  //     isSubscribedToBackend: true|false
  //     disposeSubscriptionOnDocumentHidden: true|false
  //     listener,
  //     initializationCallStack: ?Error
  //   }
  // }
  // TODO types
  subscriptions: Map<number, SubscriptionDescription<any>>;

  // How long it takes until the subscriptions are disposed backend wise when the
  // browser tab is no longer visible.
  timeUntilDisposingSubscriptionsForHiddenUi: number;
}

export interface TransitionManager {
  transitionTo(stateName: string): void;
  getActiveState(): string;
}

export type Listener<T> = (data: T) => void;

export interface SubscribeOptions<T> {
  subscriptionId: number;
  event: string;
  payload: any;
  disposeSubscriptionOnDocumentHidden?: boolean;
  listener: Listener<T>;
  initializationCallStack?: Error;
}

export interface SubscriptionDescription<T> extends SubscribeOptions<T> {
  isSubscribedToBackend: boolean;
}

export interface Connection {
  init(): void;
  subscribe<T>(options: SubscribeOptions<T>): void;
  unsubscribe(subscriptionId: number): void;
  getNewSubscriptionId(): number;
  on<T>(event: string, fn: Listener<T>): void;
  off<T>(event: string, fn: Listener<T>): void;
  send(event: string, data: any): void;
}
