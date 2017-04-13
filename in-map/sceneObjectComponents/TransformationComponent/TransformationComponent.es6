import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { requestRendering } from 'in-map/stores/renderingStore';
import { Vector3 } from 'in-map/3DLibProvider';

export default class TransformationComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_transformation');

    this.transform = {
      position: new Vector3(0, 10000, 0),
      scale: new Vector3(1, 1, 1)
    };

    this.emitToClient('transformationChanged', this.transform);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      this.sceneObject.eventEmitter.on('powerChanged').subscribe(power => {
        const currentScale = this.getScale();
        this.setScaleXYZ(currentScale.x, power, currentScale.z);
      })
    );
  }

  setPositionXYZ(x, y, z) {
    const position = this.transform.position;
    if (position.x === x && position.y === y && position.z === z) {
      return;
    }

    position.set(x, y, z);
    this.emitToClient('transformationChanged', this.transform);
    this.emitToClient('positionChanged', position);
    requestRendering();
  }

  setPosition(newPosition) {
    this.setPositionXYZ(newPosition.x, newPosition.y, newPosition.z);
  }

  setScaleXYZ(x, y, z) {
    const scale = this.transform.scale;
    if (scale.x === x && scale.y === y && scale.z === z) {
      return;
    }

    scale.set(x, y, z);
    this.emitToClient('transformationChanged', this.transform);
    requestRendering();
  }

  setTransform(position, scale) {
    this.setTransformXYZ(position.x, position.y, position.z, scale.x, scale.y, scale.z);
  }

  setTransformXYZ(px, py, pz, sx, sy, sz) {
    const position = this.transform.position;
    const scale = this.transform.scale;
    if (
      position.x === px && position.y === py && position.z === pz && scale.x === sx && scale.y === sy && scale.z === sz
    ) {
      return;
    }
    position.set(px, py, pz);
    scale.set(sx, sy, sz);
    this.emitToClient('transformationChanged', this.transform);
    this.emitToClient('positionChanged', position);
    requestRendering();
  }

  setScale(newScale) {
    this.setScaleXYZ(newScale.x, newScale.y, newScale.z);
  }

  getPosition() {
    return this.transform.position;
  }

  getScale() {
    return this.transform.scale;
  }

  dispose() {
    super.dispose();

    this.transform = null;
  }
}
