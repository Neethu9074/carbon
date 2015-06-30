'use strict';

import State from '../../State';
import {level, zoomLevel} from 'instana-ui-services/stores/zoomLevel';

export default class NearestState extends State {

  constructor(controller) {
    super(controller);

    this.from = 250;
    this.to = 1000000;
  }

  enter() {
    zoomLevel.emit(level.mid);
  }

  leave() {
  }

  getNext(zLevel) {
    if(zLevel <= this.from) {
      return this.owner.states.near;
    }
    return undefined;
  }
}
