import { setHighlightedEntityId, clearHighlightedEntityId } from 'in-services/stores/highlightedEntityId';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import Decorator from 'in-map/misc/common/cameraController/decorator/Decorator';
import { setTooltip, clear as clearTooltip } from 'in-map/stores/tooltipStore';
import connections from 'in-map/stores/connectionsStore';
import { emptyArray } from 'in-services/fixedObjects';
import { Raycaster } from 'in-map/3DLibProvider';

export default class RayCasterDecorator extends Decorator {
  constructor(controller, map) {
    super(controller);

    // raytracing fields
    this.raycaster = new Raycaster();

    this.map = map;

    this.currentConnections = emptyArray;

    this.addProperty('lastHitten', {
      object: null,
      connections: emptyArray
    });
    this.addProperty('getObjectOnCursor', this.getObjectOnCursor.bind(this));
    this.addProperty('getPointOfImpact', this.getPointOfImpact.bind(this));
  }

  init() {
    super.init();
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      this.eventEmitter.on('onMouseMoved').subscribe(() => this.handleRayCasting()),

      // each time a connection is created, this one fires. To avoid massive Object->Array mappings
      // debounce this stream
      connections.stream.debounce(100).subscribe(_connections =>
        this.currentConnections = Object.keys(_connections).map(key => _connections[key]))
    ]);
  }

  handleRayCasting() {
    const lastHitten = this.cameraController.lastHitten;

    // save the old state to compare with new data
    const lastHittenObject = lastHitten.object;
    const lastHoveredConnections = lastHitten.connections;

    const { hittenObject, hoveredConnections } = this.cameraController.getObjectOnCursor();

    // replace with the new data
    lastHitten.object = hittenObject;
    lastHitten.connections = hoveredConnections;

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

    if (lastHoveredConnections.length !== hoveredConnections.length) {
      if (hoveredConnections.length > 0) {
        setHighlightedEntityId(hoveredConnections[0].id);
        setTooltip(hoveredConnections);
      } else {
        clearHighlightedEntityId();
        clearTooltip();
      }
    }
  }

  getObjectOnCursor() {
    const camera = this.cameraController.camera.getRenderableCamera();

    // update raycaster
    this.raycaster.setFromCamera(this.cameraController.screenSpaceCursorPosition, camera);

    // find the hitten object
    const hittenObject = PhysicsServiceLocator.checkRaycaster(this.raycaster);
    const hoveredConnections = hittenObject
      ? emptyArray
      : // don't calculate if another object than a connection was hitten
        this.currentConnections.filter(connection => connection.intersects(this.raycaster));

    return {
      hittenObject,
      hoveredConnections
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
