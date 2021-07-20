/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export interface TransitionManager {
  transitionTo(stateName: string): void;
  getActiveState(): string;
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

export interface Connection {
  init(): void;
  subscribe(options: SubscribeOptions): void;
  unsubscribe(subscriptionId: number): void;
  getNewSubscriptionId(): number;
  on<T>(event: string, fn: Listener<T>): void;
  off<T>(event: string, fn: Listener<T>): void;
  send(event: string, data: any): void;
}
