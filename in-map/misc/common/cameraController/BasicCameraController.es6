import RoEmitter from 'roemitter';

import {setSelectedSnapshotId, clearSelectedSnapshotId} from 'in-stores/snapshot';
import {requestRendering} from 'in-map/stores/renderingStore';
import {clearSelectedIncident} from 'in-stores/incident';
import {getFactory} from 'in-map/stores/factoriesStore';
import {Object3D, Vector3} from 'in-map/3DLibProvider';
import {emptyArray} from 'in-services/fixedObjects';
import {clearSelectedEvent} from 'in-stores/events';
import {goToDashboard} from 'in-stores/navigation';
import activeTheme from 'in-themes/active.json';
import {height} from 'in-map/stores/indexStore';
import Subscriber from 'in-map/misc/Subscriber';
import {ZERO} from 'in-map/misc/fixedVectors';


const FOCUS_MARGIN = 0.02;
const BOTTOM_MARGIN_IN_PX = activeTheme.footer.height;

export default class BasicCameraController extends Subscriber {

  constructor(camera, factoryIdForFocusCalculation) {
    super();

    this.camera = camera;
    this.eventEmitter = new RoEmitter('control event emitter');

    // the starting angle for yaw axis
    this.startingYaw = -40;

    // the starting angle pitch yaw axis
    this.startingPitch = -35;

    this.factoryIdForFocusCalculation = factoryIdForFocusCalculation;
  }

  init() {
    // transformation helper. need this to move on the ground
    this.camTransformObject = new Object3D();
    this.camTransformObject.position.set(0, 0, 0);
    this.camTransformObject.rotation.y = this.startingYaw * Math.PI / 180;

    this.camPitchObject = new Object3D();
    this.camPitchObject.rotation.x = this.startingPitch * Math.PI / 180;
    this.camTransformObject.add(this.camPitchObject);

    const camera = this.camera.getRenderableCamera();
    this.camPitchObject.add(camera);

    this.updateCamera();
  }

  initEvents() {
    this.addSubscriptions([
      this.eventEmitter.on('onClicked').subscribe(() => {
        const {object, connections} = this.lastHitten;

        if (object) {
          const parentSceneObject = object.parentSceneObject;
          const sceneObject = parentSceneObject ? parentSceneObject : object;
          setSelectedSnapshotId(sceneObject.id);

        // dont reset the click if you clicken on connections
        } else if (connections.length === 0) {
          // the was something clicked but no object or connection available -> reset
          clearSelectedSnapshotId();
          clearSelectedIncident();
          clearSelectedEvent();
        } else {
          setSelectedSnapshotId(connections[0].id);
        }
      }),

      this.eventEmitter.on('onDoubleClicked').subscribe(() => {
        if (this.lastHitten.object) {
          goToDashboard(this.lastHitten.object.parentSceneObject.id);
        }
      })
    ]);
  }

  moveRelative(dx, dz) {
    this.camTransformObject.translateX(dx);
    this.camTransformObject.translateZ(dz);
    this.updateCamera();
  }

  moveAbsolute(dx, dz) {
    this.camTransformObject.position.x += dx;
    this.camTransformObject.position.z += dz;
    this.updateCamera();
  }

  flyToPosition({x, z}) {
    this.camTransformObject.position.setX(x);
    this.camTransformObject.position.setZ(z);

    this.updateCamera();
  }

  focusMap() {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = -1 * Number.MAX_VALUE;
    let maxY = -1 * Number.MAX_VALUE;
    const yOffset = Math.min(BOTTOM_MARGIN_IN_PX / height, 1);

    const vertices = this.getFactoryVertices();
    if (!vertices) {
      this.flyToPosition(ZERO);
      return;
    }

    for (let i = 0, length = vertices.length; i < length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 2];

      const screenPosition = new Vector3(x, 0, z);
      this.getScreenPosition(screenPosition);

      const screenX = screenPosition.x;
      const screenY = screenPosition.y - yOffset;

      minX = Math.min(minX, screenX);
      minY = Math.min(minY, screenY);
      maxX = Math.max(maxX, screenX);
      maxY = Math.max(maxY, screenY);
    }

    minX -= FOCUS_MARGIN;
    minY -= FOCUS_MARGIN;
    maxX += FOCUS_MARGIN;
    maxY += FOCUS_MARGIN;

    const positionOnTheGround = this.getPointOfImpact({
      x: minX + (maxX - minX) / 2,
      y: minY + (maxY - minY) / 2
    });
    this.flyToPosition(positionOnTheGround);

    // calculate relative scale
    const widthInScreenSpace = maxX - minX;
    const heightInScreenSpace = maxY - minY;

    // screenSpace goes from [-1, 1]
    const inPercent = widthInScreenSpace > heightInScreenSpace
      ? widthInScreenSpace / 2
      : heightInScreenSpace / 2;

    const zoomLevelToSet = this.zoomLevel * inPercent;

    // this.zoom(zoomLevelToSet - this.zoomLevel);
    this.setZoomLevelAbsolute(zoomLevelToSet);
  }

  getScreenPosition(position) {
    position.applyProjection(this.camera.getRenderableCamera().projection);
  }

  // default zoom implementation
  zoom() {}

  // default update implementation
  update() {}

  updateCamera() {
    this.camTransformObject.updateMatrixWorld();
    this.camPitchObject.updateMatrixWorld();

    // apply current transformations
    this.camera.update();

    requestRendering();

    // TODO: clamp the position to avoid overflow of the level area
  }

  getCameraController() {
    return this;
  }

  getFactoryVertices() {
    const factory = getFactory(this.factoryIdForFocusCalculation);
    if (!factory) {
      return emptyArray;
    }

    const attribute = factory.geometry.attributes.position;
    if (!attribute) {
      return emptyArray;
    }

    return attribute.array;
  }

  dispose() {
    super.dispose();

    this.eventEmitter.dispose();
    this.camera = null;
  }
}
