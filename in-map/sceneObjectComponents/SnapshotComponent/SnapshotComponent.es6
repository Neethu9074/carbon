import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getSnapshot } from 'in-stores/snapshot';

export default class IconComponent extends SceneObjectComponent {
  constructor(sceneObject, alternativeId) {
    super(sceneObject, '_snapshot');

    this.alternativeId = alternativeId;
  }

  initEvents() {
    super.initEvents();

    const snapshotChangedCallback = this.snapshotChanged.bind(this);
    this.addSubscription(
      getSnapshot(this.alternativeId ? this.alternativeId : this.sceneObject.id).subscribe(snapshotChangedCallback)
    );
  }

  snapshotChanged(snapshot) {
    this.emitToClient('snapshotChanged', snapshot);
  }

  dispose() {
    super.dispose();

    this.alternativeId = null;
  }
}
