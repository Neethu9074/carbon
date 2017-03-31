import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { getSnapshot } from 'in-stores/snapshot';

export default class IconComponent extends SceneObjectComponent {
  constructor(sceneObject, alternativeId) {
    super(sceneObject, '_snapshot');

    this.alternativeId = alternativeId;
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      getSnapshot(this.alternativeId ? this.alternativeId : this.sceneObject.id).subscribe(snapshot =>
        this.emitToClient('snapshotChanged', snapshot))
    );
  }

  dispose() {
    super.dispose();

    this.alternativeId = null;
  }
}
