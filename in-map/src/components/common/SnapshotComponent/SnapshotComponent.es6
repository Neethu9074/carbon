import Component from 'in-map/src/components/common/Component';
import {getSnapshot} from 'in-stores/snapshot';


export default class SnapshotComponent extends Component {
  constructor({sceneObject, id}) {
    super(sceneObject, '_snapshot');

    this.snapshotToSet = null;
    this.snapshotSubscription = getSnapshot(id ? id : sceneObject.id)
                                  .subscribe(snapshot => this.onSnapshotUpdate(snapshot));

    this.initialized();
  }

  onSnapshotUpdate(snapshot) {
    this.snapshotToSet = snapshot;
    this.needsUpdate = true;
  }

  update() {
    // keep the last set health and only set this if the component is active
    if (this.isActive()) {
      this.emit('snapshotChanged', this.snapshotToSet);
      this.needsUpdate = false;
    }
  }

  dispose() {
    super.dispose();

    this.snapshotSubscription.dispose();
    this.snapshotSubscription = null;
    this.snapshotToSet = null;
  }
}
