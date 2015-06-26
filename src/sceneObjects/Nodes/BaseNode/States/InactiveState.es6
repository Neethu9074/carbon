'use strict';

import State from '../../../../State';

export default class InactiveState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    this.owner.removeCollisionObject(this.owner.cube, 1);

    //add metric pillar to octree
    this.owner.addMetricCollisionObject();
  }

  leave() {
    this.owner.addCollisionObject(this.owner.cube, 1);

    //add metric pillar to octree
    this.owner.disposeMetricCollisionObject();
  }

  getNext({inactive, highlighted}) {
    if(inactive === false) {
      if(highlighted) {
        return this.owner.states.highlighted;
      } else {
        return this.owner.states.initial;
      }
    }
    return undefined;
  }
}
