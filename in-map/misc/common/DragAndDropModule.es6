import THREE from 'three';

import {onDown} from 'in-services/reactiveMouseEvents';
import {findObjectByRay} from 'in-map/misc/Physics';
import {eventBus} from 'in-map/services/eventBus';
import Module from 'in-map/misc/common/Module';


export default class RaycasterModule extends Module {

  constructor(params) {
    super(params);

    // raytracing fields
    this.raycaster = new THREE.Raycaster();

    this.dragedObjectId = false;

    // holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.cursorForRay = new THREE.Vector2();

    this.mouseMoveSubscription;

    this.cursorPosition = { x: 0, y: 0 };

    this.initEvents();
  }

  initEvents() {
    this.addSubscriptions([
      this.eventEmitter.on('onMouseMoved')
      .subscribe(({x, y}) => {
        this.cursorPosition.x = x;
        this.cursorPosition.y = y;
      }),

      this.eventEmitter.on('onMouseLeave')
      .subscribe(() => {
        this.cursorPosition.x = Infinity;
        this.cursorPosition.y = Infinity;
      }),

      onDown(this.canvas, () => {
        const objectOnCursor = this.getObjectOnCursor();
        this.dragedObjectId = objectOnCursor ? objectOnCursor.parentSceneObject.id : null;
      }),

      this.eventEmitter.on('onPanStart').subscribe(() => {
        this.eventEmitter.emit('isDragingObject', this.dragedObjectId ? this.dragedObjectId : false);

        if (this.dragedObjectId) {
          eventBus.emit('dragObjectStart', this.dragedObjectId);
          this.mouseMoveSubscription = this.eventEmitter.on('onMouseMoved').subscribe(event => {
            this.updateCursorForRayCasting(event.x, event.y);
            const pointOfImpact = this.getPointOfImpact();
            if (pointOfImpact) {
              eventBus.emit('dragObject', pointOfImpact);
            }
          });
        }
      }),

      this.eventEmitter.on('onPanEnd').subscribe(() => {
        eventBus.emit('dragObjectStart', null);
        eventBus.emit('dragObjectStop', this.dragedObjectId);

        this.dragedObjectId = null;

        if (this.mouseMoveSubscription) {
          this.mouseMoveSubscription.dispose();
          this.mouseMoveSubscription = null;
        }
      })
    ]);
  }

  getObjectOnCursor() {
    // get the mouse/touch position in pixel coords
    const x = this.cursorPosition.x;
    const y = this.cursorPosition.y;

    this.updateCursorForRayCasting(x, y);

    // update raycaster
    this.raycaster.setFromCamera(this.cursorForRay, this.camera.getRenderableCamera());

    // find the hitten object
    return findObjectByRay(this.raycaster);
  }

  updateCursorForRayCasting(x, y) {
    // transform into screen space
    this.cursorForRay.x = (x / this.camera.width) * 2 - 1;
    this.cursorForRay.y = -(y / this.camera.height) * 2 + 1;
  }

  getPointOfImpact() {
    const mousePos = this.cursorForRay;

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mousePos, this.camera.getRenderableCamera());

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects([this.map.groundPlane.getCollisionMesh()]);
    if (intersects.length >= 1) {
      return intersects[0].point;
    }
  }

  dispose() {
    super.dispose();
  }
}
