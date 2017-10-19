import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getSnapshot } from 'in-stores/snapshot';

export default class SnapshotComponent extends SceneObjectComponent {
  constructor(sceneObject, alternativeId, lazy = false) {
    super(sceneObject, '_snapshot');

    this.alternativeId = alternativeId;
    this.isLazy = lazy;
  }

  initEvents() {
    super.initEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);

    if (this.isLazy) {
      this.visibleSubscription = this.sceneObject.eventEmitter
        .on('isVisibleChanged' + this.sceneObject.id)
        .nextFrame()
        .debounce(200)
        .subscribe(isVisible => {
          if (isVisible) {
            this.visibleSubscription.dispose();
            this.visibleSubscription = null;
            this.addSubscription(
              getSnapshot(this.alternativeId ? this.alternativeId : this.sceneObject.id).subscribe(
                snapshotChangedCallback
              )
            );
          }
        });
    } else {
      this.addSubscription(
        getSnapshot(this.alternativeId ? this.alternativeId : this.sceneObject.id).subscribe(snapshotChangedCallback)
      );
    }
  }

  snapshotChanged(snapshot) {
    this.emitToClient('snapshotChanged', snapshot);
  }

  dispose() {
    super.dispose();

    if (this.visibleSubscription) {
      this.visibleSubscription.dispose();
      this.visibleSubscription = null;
    }
  }
}
