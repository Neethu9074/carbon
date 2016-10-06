import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {requestRendering} from 'in-map/stores/renderingStore';
import {ZERO} from 'in-map/misc/fixedVectors';
import {Vector3} from 'in-map/3DLibProvider';


export default class TransformationComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_transformation');

    this.position = ZERO.clone();
    this.position.setY(10000);
    this.scale = new Vector3(1, 1, 1);

    this.emitToClient('scaleChanged', this.scale);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(this.sceneObject.eventEmitter.on('powerChanged').subscribe(power => {
      const currentScale = this.getScale();
      this.setScaleXYZ(currentScale.x, power, currentScale.z);
    }));
  }

  setPositionXYZ(x, y, z) {
    if (this.position.x === x &&
        this.position.y === y &&
        this.position.z === z) {
      return;
    }

    this.position.set(x, y, z);
    this.emitToClient('positionChanged', this.position);
    requestRendering();
  }

  setPosition(newPosition) {
    this.setPositionXYZ(newPosition.x, newPosition.y, newPosition.z);
  }

  setScaleXYZ(x, y, z) {
    if (this.scale.x === x &&
        this.scale.y === y &&
        this.scale.z === z) {
        return;
      }

    this.scale.set(x, y, z);
    this.emitToClient('scaleChanged', this.scale);
    requestRendering();
  }

  setScale(newScale) {
    this.setScaleXYZ(newScale.x, newScale.y, newScale.z);
  }

  getPosition() {
    return this.position;
  }

  getScale() {
    return this.scale;
  }

  dispose() {
    super.dispose();

    this.position = null;
    this.scale = null;
  }
}
