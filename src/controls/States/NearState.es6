'use strict';

import State from './State';
import {level, zoomLevel} from 'instana-ui-services/stores/zoomLevel';

export default class NearestState extends State {

  constructor(controller) {
    super(controller);

    this.from = 100;
    this.to = 250;
  }

  enter() {
    zoomLevel.emit(level.near);
  }

  leave() {
  }

  getNext(zLevel) {
    if(zLevel > this.to) {
      return this.owner.states.mid;
    } else if(zLevel <= this.from) {
      return this.owner.states.nearest;
    }
    return undefined;
  }
}
