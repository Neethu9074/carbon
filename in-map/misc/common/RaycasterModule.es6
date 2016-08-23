import {Raycaster} from 'three';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import PhysicsServiceLocator from 'in-map/misc/serviceLocator/physics/PhysicsServiceLocator';
import {setTooltip, clear as clearTooltip} from 'in-map/stores/tooltipStore';
import connections from 'in-map/stores/connectionsStore';
import {emptyArray} from 'in-services/fixedObjects';
import Module from 'in-map/misc/common/Module';


export default class RaycasterModule extends Module {

  constructor(params) {
    super(params);

    this.hoveredConnections = emptyArray;

    // raytracing fields
    this.raycaster = new Raycaster();

    this.currentConnections = emptyArray;

    this.initEvents();
  }

  initEvents() {
    this.addSubscriptions([
      this.eventEmitter.on('onMouseMoved').subscribe(() => this.handleRayCasting()),

      this.eventEmitter.on('onMouseLeave').subscribe(() => this.handleRayCasting()),

      this.eventEmitter.on('onZoom').subscribe(() => this.handleRayCasting()),

      this.eventEmitter.on('onClicked').subscribe(() => this.onClicked()),

      this.eventEmitter.on('onDoubleClicked').subscribe(() => this.onDoubleClicked()),

      connections.stream.subscribe(_connections =>
        this.currentConnections = Object.keys(_connections).map(key => _connections[key]))
    ]);
  }

  handleRayCasting() {
    const lastHittenObject = this.client.hittenObject;
    const lastHoveredConnections = this.client.hoveredConnections;

    const {hittenObject, hoveredConnections} = this.getObjectOnCursor();
    this.client.setCurrentHittenObjects(hittenObject, hoveredConnections);

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

  checkObject(mesh) {
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.client.screenSpaceCursorPosition, this.camera.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects([mesh]);
    if (intersects.length >= 1) {
      return intersects[0].point;
    }
  }

  onClicked() {
    this.eventEmitter.emit('onObjectClicked', this.getObjectOnCursor());
  }

  onDoubleClicked() {
    const {hittenObject} = this.getObjectOnCursor();
    if (hittenObject) {
      this.eventEmitter.emit('onObjectDoubleClicked', hittenObject);
    }
  }

  getObjectOnCursor() {
    // update raycaster
    this.raycaster.setFromCamera(this.client.screenSpaceCursorPosition, this.camera.camera);

    // find the hitten object
    const hittenObject = this.hittenObject = PhysicsServiceLocator.checkRaycaster(this.raycaster);
    const hoveredConnections = hittenObject ?
      emptyArray : // don't calculate if another object than a connection was hitten
      this.currentConnections.filter(connection => connection.intersects(this.raycaster));

    this.hoveredConnections = hoveredConnections;

    return {
      hittenObject,
      hoveredConnections
    };
  }

  dispose() {
    super.dispose();

    this.raycaster = null;
  }
}
