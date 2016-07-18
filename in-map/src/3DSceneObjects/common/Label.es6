import SnapshotComponent from 'in-map/src/components/common/SnapshotComponent/SnapshotComponent';

import SceneObject from './SceneObject';


export default class Label extends SceneObject {

  constructor({id, parent, snapshotId, iconSize = 1}) {
    super({parent, id: id + '_label', snapshotId});

    this.factory = parent.getFactory('singleMeshGlyphPointsFactory');
    this.fragment = this.getFragment(iconSize);
    this.positionHandler = this.getPositionHandler();

    this.addSubscriptions([
      this.eventEmitter.on('positionChanged').subscribe(this.positionChanged.bind(this)),
      this.eventEmitter.on('snapshotChanged').subscribe(this.onSnapshotUpdated.bind(this))
    ]);
  }

  getFragment() { throw new Error('PLEASE OVERRIDE METHOD'); }
  getPositionHandler() { throw new Error('PLEASE OVERRIDE METHOD'); }

  onInactiveEnter() {
    this.factory.removeFragment(this.id);
  }

  onInactiveLeave() {
    this.factory.addFragment(this.fragment);
  }


  getSnapshotId() {
    return this.parent.id;
  }

  initComponents(props) {
    super.initComponents();

    this.components.snapshot = new SnapshotComponent({
      sceneObject: this,
      id: props.snapshotId || this.parent.id
    });
  }

  positionChanged(newPosition) {
    this.positionHandler.position.x = newPosition.x;
    this.positionHandler.position.y = newPosition.y;
    this.positionHandler.position.z = newPosition.z;

    this.updateFragment();
  }

  updateFragment() {
    if (this.isActive()) {
      this.factory.addFragment(this.fragment);
    }
  }

  dispose() {
    super.dispose();

    this.factory.removeFragment(this.id);
    this.snapshotId = null;
    this.id = null;
  }
}
