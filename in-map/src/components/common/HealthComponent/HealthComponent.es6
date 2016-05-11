import Immutable from 'immutable';

import {getHealthInfoAtFocusedMoment} from 'in-stores/events';
import {health} from 'in-services/health';

import Component from '../Component';


const defaultHealth = Immutable.fromJS({
  maxSeverity: 0
});

export default class HealthComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject, '_health');

    this.healthToSet = undefined;
    this.setHealth(defaultHealth);
    this.healthSubscribtion = getHealthInfoAtFocusedMoment(sceneObject.id)
      .subscribe(this.setHealth.bind(this));

    this.initialized();
  }

  onInactiveEnter() {
    this.emit('healthChanged', health.ok);
  }

  onInactiveLeave() {
    this.emit('healthChanged', this.healthToSet);
  }


  setHealth(newHealthInfo) {
    const maxSeverity = newHealthInfo.get('maxSeverity', 0);
    if (this.healthToSet === maxSeverity) {
      return;
    }

    this.healthToSet = maxSeverity;
    this.needsUpdate = true;
  }

  update() {
    // keep the last set health and only set this if the component is active
    if (this.isActive()) {
      this.emit('healthChanged', this.healthToSet);
      this.needsUpdate = false;
    }
  }

  dispose() {
    super.dispose();

    if (this.healthSubscribtion) {
      this.healthSubscribtion.dispose();
      this.healthSubscribtion = null;
    }
    this.healthToSet = null;
  }
}
