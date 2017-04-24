import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';

export default class HealthComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_health');
  }

  initEvents() {
    super.initEvents();

    const healthChangedCallback = this.healthChanged.bind(this);
    this.addSubscription(getHealthInfoAtFocusedMoment(this.sceneObject.id).subscribe(healthChangedCallback));
  }

  healthChanged(health) {
    this.emitToClient('healthChanged', health);
  }
}
