import {getHealth} from 'in-services/issueTracker';
import {health} from 'in-services/health';

import Component from '../Component';


export default class HealthComponent extends Component{
  constructor({sceneObject}) {
    super(sceneObject);

    this.setHealth(health.ok);

    this.healthToSet = undefined;
    this.healthSubscribtion =
      getHealth(sceneObject.snapshot).subscribe(newHealth =>
        this.setHealth(newHealth));

    this.initialized();
  }

  onInactiveEnter() {
    this.sceneObject.healthChanged(health.ok);
  }

  onInactiveLeave() {
    this.needsUpdate = true;
  }


  setHealth(newHealth) {
    if(this.healthToSet === newHealth) {
      return;
    }

    this.healthToSet = newHealth;
    this.needsUpdate = true;
  }

  update() {
    //keep the last set health and only set this if the component is active
    if(this.isActive()) {
      this.sceneObject.healthChanged(this.healthToSet);
      this.needsUpdate = false;
    }
  }

  dispose() {
    super.dispose();

    if(this.healthSubscribtion) {
      this.healthSubscribtion.dispose();
      this.healthSubscribtion = null;
    }
    this.healthToSet = null;
  }
}
