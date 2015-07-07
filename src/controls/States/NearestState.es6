'use strict';

import State from './State';
import {level, zoomLevel} from 'instana-ui-services/stores/zoomLevel';

export default class NearestState extends State {

  constructor(controller) {
    super(controller);

    this.from = 0;
    this.to = 100;
  }

  enter() {
    zoomLevel.emit(level.nearest);
  }

  leave() {
  }

  getNext(zLevel) {
    if(zLevel > this.to) {
      return this.owner.states.near;
    }
    return undefined;
  }
}
