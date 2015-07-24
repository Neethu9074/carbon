'use strict';

import MetricPillar from '../MetricPillar';


export default class MultiMetricPillar extends MetricPillar {

  constructor({parent}) {
    super({parent});
  }

  //for the multi metric pillars
  addToMetricFactory() {
    const pos = this.getComponent('position')
      .getPosition()
      .clone()
      .add({x: -0.5, y: 0, z: 0.5});
    const dim = this.metricCube.scale;
    const tiles = [];
    for (let i = 0; i < this.scene.numTiles; i++) {
      tiles[i] = {
        old: {from: 0, to: 0},
        new: {from: 0, to: 0}
      };
    }

    this.scene.multiMetricFactory.addFragment({id: this.id, pos, dim, tiles});
  }

  removeFromMetricFactory() {
    this.scene.multiMetricFactory.removeFragment(this.id);
  }

  getFragment() {
    return this.scene.multiMetricFactory.getFragment(this.id);
  }

  setMetricValue(values) {
    this.newMetricValues = values;

    //set the value to the total node height for better mouseover
    this.updateMetricCollisionObject(this.parent.height);
  }

  dispose() {
    super.dispose();
  }
}
