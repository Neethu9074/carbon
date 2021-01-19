/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import RoEmitter from '@instana/roemitter';

export default function createEventBusService(id) {
  let eventEmitter = new RoEmitter(`global_event_bus:${id}`);

  function emit(msg, payload) {
    return eventEmitter.emit(msg, payload);
  }

  function on(msg) {
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
