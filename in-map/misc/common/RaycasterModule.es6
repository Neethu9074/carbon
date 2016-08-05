import THREE from 'three';

import {setHighlightedEntityId, clearHighlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {setTooltip, clear as clearTooltip} from 'in-map/stores/tooltipStore';
import connections from 'in-map/stores/logical/connectionsStore';
import {emptyArray} from 'in-services/fixedObjects';
import {findObjectByRay} from 'in-map/misc/Physics';
import Module from 'in-map/misc/common/Module';


export default class RaycasterModule extends Module {

  constructor(eventEmitter, scene, camera) {
    super(eventEmitter);

    this.scene = scene;
    this.camera = camera;

    // raytracing fields
    this.raycaster = new THREE.Raycaster();

    // holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.cursorForRay = new THREE.Vector2();

    this.cursorPosition = { x: 0, y: 0 };

    this.currentConnections = emptyArray;

    this.initEvents();
  }

  initEvents() {
    this.addSubscriptions([
      this.eventEmitter.on('onMouseMoved')
      .subscribe(({x, y}) => {
        this.cursorPosition.x = x;
        this.cursorPosition.y = y;
        this.handleRayCasting();
      }),

      this.eventEmitter.on('onMouseLeave')
      .subscribe(() => {
        this.cursorPosition.x = Infinity;
        this.cursorPosition.y = Infinity;
        this.handleRayCasting();
      }),

      this.eventEmitter.on('onZoom').subscribe(this.handleRayCasting.bind(this)),

      this.eventEmitter.on('onClicked').subscribe(() => this.onClicked()),

      this.eventEmitter.on('onDoubleClicked').subscribe(() => this.onDoubleClicked()),

      connections.stream.debounce(1000).subscribe(_connections =>
        this.currentConnections = Object.keys(_connections.objects).map(key => _connections.objects[key]))
    ]);
  }

  handleRayCasting() {
    const oldHittenObject = this.hittenObject;
    const {hittenObject, hoveredConnections} = this.getObjectOnCursor();

    if (hittenObject) {
      setHighlightedEntityId(hittenObject.parentSceneObject.id);
      setTooltip(hittenObject.parentSceneObject);
    } else if (hoveredConnections.length > 0) {
      setHighlightedEntityId(hoveredConnections[0].id);
      setTooltip(hoveredConnections);
    } else if (oldHittenObject) {
      clearHighlightedEntityId();
      clearTooltip();
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
    const hittenObject = this.hittenObject = findObjectByRay(this.raycaster);
    const hoveredConnections = hittenObject ?
      emptyArray : // don't calculate if another object than a connection was hitten
      this.currentConnections.filter(connection => connection.intersects(this.raycaster));

    return {
      hittenObject,
      hoveredConnections
    };
  }

  dispose() {
    super.dispose();

    this.cursorPosition = null;
    this.cursorForRay = null;
    this.raycaster = null;
    this.camera = null;
    this.scene = null;
  }
}
