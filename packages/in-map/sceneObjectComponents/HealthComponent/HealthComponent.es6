import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';

export default class HealthComponent extends SceneObjectComponent {
  constructor(sceneObject, lazy = false) {
    super(sceneObject, '_health');

    this.isLazy = lazy;

    // send initial health event because the backend subscription doesn't return if there is no health
    this.healthChanged(null);
  }

  initEvents() {
    super.initEvents();

    const healthChangedCallback = this.healthChanged.bind(this);

    if (this.isLazy) {
      this.visibleSubscription = this.sceneObject.eventEmitter
        .on('isVisibleChanged' + this.sceneObject.id)
        .nextFrame()
        .debounce(200)
        .subscribe(isVisible => {
          if (isVisible) {
            this.visibleSubscription.dispose();
            this.visibleSubscription = null;

            this.addSubscription(getHealthInfoAtFocusedMoment(this.sceneObject.id).subscribe(healthChangedCallback));
          }
        });
    } else {
      this.addSubscription(getHealthInfoAtFocusedMoment(this.sceneObject.id).subscribe(healthChangedCallback));
    }
  }

  healthChanged(health) {
    this.emitToClient('healthChanged', health);
  }

  dispose() {
    super.dispose();

    if (this.visibleSubscription) {
      this.visibleSubscription.dispose();
      this.visibleSubscription = null;
    }
  }
}
