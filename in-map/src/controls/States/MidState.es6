import {level, zoomLevel} from 'in-services/stores/zoomLevel';

import State from './State';


export default class MidState extends State {

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
