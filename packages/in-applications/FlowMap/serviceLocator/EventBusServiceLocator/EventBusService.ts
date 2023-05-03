/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// @ts-expect-error This will be fixed in UI-foundation
import RoEmitter from '@instana/roemitter';

export default function createEventBusService() {
  let eventEmitter = new RoEmitter(`global_event_bus`);

  function emit(msg: string, payload: boolean) {
    return eventEmitter.emit(msg, payload);
  }

  function on(msg: string) {
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
