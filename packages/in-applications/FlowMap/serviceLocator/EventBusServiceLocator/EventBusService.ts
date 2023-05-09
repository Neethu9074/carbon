/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error This will be fixed in UI-foundation
import RoEmitter from '@instana/roemitter';

export interface EventBusService {
  emit: (msg: string, payload: boolean) => void;
  on: (msg: string) => void;
  dispose: () => void;
}

export default function createEventBusService(): EventBusService {
  let eventEmitter = new RoEmitter(`global_event_bus`);

  function emit(msg: string, payload: boolean): void {
    return eventEmitter.emit(msg, payload);
  }

  function on(msg: string): void {
    return eventEmitter.on(msg);
  }

  function dispose() {
    eventEmitter.dispose();
    eventEmitter = null;
  }

  return {
    emit,
    on,
    dispose
  };
}
