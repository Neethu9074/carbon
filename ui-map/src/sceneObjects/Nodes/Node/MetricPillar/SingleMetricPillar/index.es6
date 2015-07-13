'use strict';

import MetricPillar from '../MetricPillar';


export default class SingleMetricPillar extends MetricPillar {

  constructor({parent}) {
    super({parent});
  }

  onInactiveEnter() {
    this.scene.removeCollisionObject(this.metricCube, 2);
    this.removeFromMetricFactory();
  }

  onInactiveLeave() {
    this.addToMetricFactory();
    this.scene.addCollisionObject(this.metricCube, 2);
  }

  //for the single metric pillar
  addToMetricFactory() {
    const pos = this.getPosition();
    const dim = this.metricCube.scale;

    this.scene.singleMetricFactory.addFragment({
      id: this.id, pos, dim, newHeight: 0
    });
  }

  removeFromMetricFactory() {
    this.scene.singleMetricFactory.removeFragment(this.id);
  }

  getFragment() {
    return this.scene.singleMetricFactory.getFragment(this.id);
  }

  setMetricValue(value) {
    const fragment = this.getFragment();
    if(fragment) {
      fragment.newHeight = 1;

      //scale the collision cube to the max pillar size
      this.updateMetricCollisionObject(value * this.parent.height);
    }
  }

  dispose() {
    super.dispose();
  }
}
