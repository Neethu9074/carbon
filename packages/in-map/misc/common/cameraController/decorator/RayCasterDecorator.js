/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { setHighlightedEntityId, clearHighlightedEntityId } from 'in-map/stores/highlightedEntityId';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import Decorator from 'in-map/misc/common/cameraController/decorator/Decorator';
import { setTooltip, clear as clearTooltip } from 'in-map/stores/tooltipStore';
import { Raycaster } from 'in-map/3DLibProvider';

export default class RayCasterDecorator extends Decorator {
  constructor(controller, map) {
    super(controller);

    // raytracing fields
    this.raycaster = new Raycaster();

    this.map = map;

    this.addProperty('lastHitten', {
      object: null
    });
    this.addProperty('getObjectOnCursor', this.getObjectOnCursor.bind(this));
    this.addProperty('getPointOfImpact', this.getPointOfImpact.bind(this));
  }

  init() {
    super.init();
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([this.eventEmitter.on('onMouseMoved').subscribe(() => this.handleRayCasting())]);
  }

  handleRayCasting() {
    const lastHitten = this.cameraController.lastHitten;

    // save the old state to compare with new data
    const lastHittenObject = lastHitten.object;

    const { hittenObject } = this.cameraController.getObjectOnCursor();

    // replace with the new data
    lastHitten.object = hittenObject;

    if (lastHittenObject !== hittenObject) {
      if (hittenObject) {
        setHighlightedEntityId(hittenObject.parentSceneObject.id);
        setTooltip(hittenObject.parentSceneObject);
      } else {
        clearHighlightedEntityId();
        clearTooltip();
      }
      return;
    }
  }

  getObjectOnCursor() {
    const camera = this.cameraController.camera.getRenderableCamera();

    // update raycaster
    this.raycaster.setFromCamera(this.cameraController.screenSpaceCursorPosition, camera);

    // find the hitten object
    const hittenObject = PhysicsServiceLocator.checkRaycaster(this.raycaster);

    return {
      hittenObject
    };
  }

  getPointOfImpact(screenPosition) {
    return this.checkObject(this.map.groundPlane.getCollisionMesh(), screenPosition);
  }

  checkObject(mesh, screenPosition) {
    screenPosition = screenPosition || this.cameraController.screenSpaceCursorPosition;

    const camera = this.cameraController.camera.getRenderableCamera();

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(screenPosition, camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects([mesh]);
    if (intersects.length >= 1) {
      return intersects[0].point;
    }
  }

  dispose() {
    super.dispose();

    this.raycaster = null;
    this.map = null;
  }
}
