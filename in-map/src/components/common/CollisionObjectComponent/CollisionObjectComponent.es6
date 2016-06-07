import Component from '../Component';
import XYZ from '../XYZ';

export default class CollisionObjectComponent extends Component {

  constructor({sceneObject, collisionObject, layer}) {
    super(sceneObject, '_collision_object');

    this.layer = layer;
    this.positionToSet = new XYZ(0, 0, 0);
    this.scaleToSet = new XYZ(1, 1, 1);

    collisionObject.parentSceneObject = sceneObject;
    collisionObject.rotationAutoUpdate = false;
    collisionObject.matrixAutoUpdate = false;
    collisionObject.isEnabled = true;
    this.collisionObject = collisionObject;

    sceneObject.addCollisionObject(collisionObject, layer);

    this.initialized();

    this.addSubscription('positionChanged', this.positionChanged);
    this.addSubscription('sizeChanged', this.sizeChanged);
  }

  onInitialEnter() {
    this.collisionObject.isEnabled = true;
  }

  onInactiveEnter() {
    this.collisionObject.isEnabled = false;
  }


  positionChanged(newPosition) {
    this.positionToSet.set(newPosition.x, newPosition.y, newPosition.z);
    this.needsUpdate = true;
  }

  sizeChanged({x, y, z}) {
    this.scaleToSet.set(x, y, z);
    this.needsUpdate = true;
  }

  update() {
    const object = this.collisionObject;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;

    object.position.set(pos.x - 0.5 + scale.x * 0.5, pos.y, pos.z + 0.5 - scale.z * 0.5);
    object.scale.set(scale.x, scale.y, scale.z);
    object.updateMatrix();
    object.updateMatrixWorld();

    this.sceneObject.removeCollisionObject(this.collisionObject, this.layer);
    this.sceneObject.addCollisionObject(this.collisionObject, this.layer);

    this.needsUpdate = false;
  }

  dispose() {
    super.dispose();

    this.collisionObject.isEnabled = false;
    this.sceneObject.removeCollisionObject(this.collisionObject, this.layer);

    this.positionToSet.dispose();
    this.scaleToSet.dispose();

    this.collisionObject = null;
    this.positionToSet = null;
    this.scaleToSet = null;
    this.layer = null;
  }
}
