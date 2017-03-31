import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';

export default class HealthComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_health');
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      getHealthInfoAtFocusedMoment(this.sceneObject.id).subscribe(health => this.emitToClient('healthChanged', health))
    );
  }
}
