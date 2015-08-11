import Component from '../Component';


export default class CollisionObjectComponent extends Component {

  constructor({sceneObject, collisionObject, layer}) {
    super(sceneObject);

    this.layer = layer;
    this.positionToSet = {x: 0, y: 0, z: 0};
    this.scaleToSet = {x: 1, y: 1, z: 1};

    collisionObject.matrixAutoUpdate = false;
    collisionObject.rotationAutoUpdate = false;
    collisionObject.parentSceneObject = sceneObject;
    collisionObject.isEnabled = true;
    this.collisionObject = collisionObject;

    sceneObject.addCollisionObject(collisionObject, layer);

    this.initialized();
  }

  onInitialEnter() {
    this.collisionObject.isEnabled = true;
  }

  onInactiveEnter() {
    this.collisionObject.isEnabled = false;
  }


  positionChanged(x, y, z) {
    this.changeXyzOf(this.positionToSet, x, y, z);
    this.needsUpdate = true;
  }

  sizeChanged(x, y, z) {
    this.changeXyzOf(this.scaleToSet, x, y, z);
    this.needsUpdate = true;
  }

  changeXyzOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  update() {
    const object = this.collisionObject;
    const pos = this.positionToSet;
    const scale = this.scaleToSet;
    object.position.set(pos.x, pos.y, pos.z);
    object.scale.set(scale.x, scale.y, scale.z);
    object.updateMatrix();
    object.updateMatrixWorld();

    this.sceneObject.scene.octrees[this.layer].rebuild();

    this.needsUpdate = false;
  }

  dispose() {
    super.dispose();

    this.collisionObject.isEnabled = false;
    this.sceneObject.removeCollisionObject(this.collisionObject, this.layer);
  }
}
