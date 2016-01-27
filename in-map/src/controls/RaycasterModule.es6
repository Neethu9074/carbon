import THREE from 'three';

import * as highlightedSnapshot from 'in-services/stores/highlightedSnapshot';
import * as tooltipStore from 'in-services/stores/tooltip';

import {allConnections} from '../SceneObjects/Connections/BaseConnection';
import ConnectionTooltip from '../Tooltips/Connection';
import {currentTooltip} from '../mapStores';
import BaseModule from './BaseModule';

const emptyArray = [];

export default class RaycasterModule extends BaseModule {

  constructor({eventEmitter, scene, camera}) {
    super(eventEmitter);

    this.scene = scene;
    this.camera = camera;

    // raytracing fields
    this.raycaster = new THREE.Raycaster();

    // holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.cursorForRay = new THREE.Vector2();

    this.cursorPosition = { x: 0, y: 0 };

    this.connectionTooltip = new ConnectionTooltip(scene, []);

    this.setupEvents();
  }

  setupEvents() {
    this.addSubscription(tooltipStore.activeTooltip.subscribe(tooltip =>
      this.tooltip2DIsActive = tooltip ? true : false));

    this.addSubscription(this.eventEmitter.on('onMouseMoved')
    .subscribe(({x, y}) => {
      this.cursorPosition.x = x;
      this.cursorPosition.y = y;
      this.handleRayCasting();
    }));

    this.addSubscription(this.eventEmitter.on('onZoom')
    .subscribe(this.handleRayCasting.bind(this)));

    this.addSubscription(this.eventEmitter.on('onClicked')
    .subscribe(() => this.onClicked()));

    this.addSubscription(this.eventEmitter.on('onDoubleClicked')
    .subscribe(() => this.onDoubleClicked()));
  }

  handleRayCasting() {
    if (this.tooltip2DIsActive) {
      currentTooltip.emit(null);
      this.hittenObject = null;
      return;
    }

    const {hittenObject, hoveredConnections} = this.getObjectOnCursor();

    if (hittenObject) {
      highlightedSnapshot.setHighlightedEntityId(hittenObject.parentSceneObject.id);
    } else {
      highlightedSnapshot.clearHighlightedEntityId();

      if (hoveredConnections.length > 0) {
        currentTooltip.emit(this.connectionTooltip);
        this.connectionTooltip.setHovered(hoveredConnections);
      } else {
        currentTooltip.emit(null);
      }
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
    const scene = this.scene;

    // get the mouse/touch position in pixel coords
    const x = this.cursorPosition.x;
    const y = this.cursorPosition.y;

    // transform into screen space
    this.cursorForRay.x = (x / scene.width) * 2 - 1;
    this.cursorForRay.y = -(y / scene.height) * 2 + 1;

    // update raycaster
    this.raycaster.setFromCamera(this.cursorForRay, this.camera.camera);

    // find the hitten object
    const hittenObject = scene.findObjectByRay(this.raycaster);
    const hoveredConnections = hittenObject ?
      emptyArray : // dont calculate if another object than a connection was hitten
      allConnections.filter(connection => connection.intersects(this.raycaster));

    return {
      hittenObject,
      hoveredConnections
    };
  }

  dispose() {
    super.dispose();

    this.connectionTooltip.dispose();
  }
}
