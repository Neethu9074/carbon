'use strict';

import State from '../../../../State';
import {health} from 'instana-ui-services/health';


export default class InactiveState extends State {

  constructor(baseNode) {
    super(baseNode);
  }

  enter() {
    const owner = this.owner;
    // owner.removeCollisionObject(owner.cube, 1);

    //add metric pillar to octree
    owner.addMetricCollisionObject();

    //save the current health, set health to ok, block the coloring for cube
    //and reset to old health
    const healthBackup = owner.health;
    owner.setHealth(health.ok);
    owner.blockCubeHealth(true);
    owner.setHealth(healthBackup);
  }

  leave() {
    const owner = this.owner;
    // owner.addCollisionObject(owner.cube, 1);

    //add metric pillar to octree
    owner.disposeMetricCollisionObject();

    //unblock the coloring for cube and reset the current health
    owner.blockCubeHealth(false);
    owner.setHealth(owner.health, true);
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
