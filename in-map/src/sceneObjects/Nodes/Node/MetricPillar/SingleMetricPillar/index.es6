

import MetricPillar from '../MetricPillar';


export default class SingleMetricPillar extends MetricPillar {

  constructor({parent}) {
    super({parent});
  }

  //for the single metric pillar
  addToMetricFactory() {
    const pos = this.getComponent('position')
      .getPosition()
      .clone()
      .add({x: -0.5, y: 0, z: 0.5});

    this.scene.singleMetricFactory.addFragment({
      id: this.id, pos, dim: {x: 1, y: 1, z: 1}, newHeight: 0
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
      fragment.newHeight = value * this.parent.height;

      this.updateMetricCollisionObject(value * this.parent.height);
    }
  }
}
