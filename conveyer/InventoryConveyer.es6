'use strict';

import Immutable from 'immutable';
import AbstractHttpConveyer from './AbstractHttpConveyer';

export default class InventoryConveyer extends AbstractHttpConveyer {

  constructor({pluginId='com.instana.forge.infrastructure.os.OS'}) {
    super({frequency: 1000});
    this.requestConfig = {
      method: 'get',
      url: '/api/snapshots/' + encodeURIComponent(pluginId)
    };
  }

  stop() {
    super.stop();
    this.previousEvent = null;
  }

  getHttpRequestConfig() {
    return this.requestConfig;
  }

  buildNextEvent(response) {
    const nextEvent = applyMinimumNumberOfMutations(
      this.previousEvent,
      response.body
    );
    if (nextEvent === this.previousEvent) {
      return false;
    }
    this.previousEvent = nextEvent;
    return this.previousEvent;
  }

}

function applyMinimumNumberOfMutations(previous, next) {
  if (previous === null || previous === undefined) {
    return Immutable.fromJS(next);
  }

  // meh, wrong! We do not want to merge! We want to translate an immutable
  // object deeply from a to b
  return previous.mergeDeep(next);
}
