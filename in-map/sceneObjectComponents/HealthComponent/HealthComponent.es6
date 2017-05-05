import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';

export default class HealthComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_health');

    // send initial health event because the backend subscription doesn't return if there is no health
    this.healthChanged(null);
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
