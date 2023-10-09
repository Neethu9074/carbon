/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Subject } from '@instana/observables';
import RoEmitter from '@instana/roemitter';

export interface EventBusService<Topics extends Record<string, boolean>> {
  emit: <Topic extends keyof Topics>(msg: Extract<Topic, string>, payload: Topics[Topic]) => void;
  on: <Topic extends keyof Topics>(msg: Extract<Topic, string>) => Subject<Topics[Topic]>;
  dispose: () => void;
}

export default function createEventBusService<Topics extends Record<string, boolean>>(): EventBusService<Topics> {
  let eventEmitter = new RoEmitter<Topics>(`global_event_bus`);

  function emit<Topic extends keyof Topics>(msg: Extract<Topic, string>, payload: Topics[Topic]): void {
    return eventEmitter.emit(msg, payload);
  }

  function on<Topic extends keyof Topics>(msg: Extract<Topic, string>): Subject<Topics[Topic]> {
    return eventEmitter.on(msg);
  }

  function dispose() {
    eventEmitter.dispose();
    // @ts-expect-error -- Keeping old cleanup logic intact
    eventEmitter = null;
  }

  return {
    emit,
    on,
    dispose
  };
}
