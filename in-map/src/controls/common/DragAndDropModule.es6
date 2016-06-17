import THREE from 'three';

import {onDown, onUp} from 'in-services/reactiveMouseEvents';
import eventBus from 'in-map/eventbus';

import Module from './Module';


export default class RaycasterModule extends Module {

  constructor({eventEmitter, canvas, scene, camera}) {
    super(eventEmitter);

    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;

    // raytracing fields
    this.raycaster = new THREE.Raycaster();

    this.dragedObject = false;

    // holds the mouse/touch position in screen coordinates (x,y) => [-1, 1]
    this.cursorForRay = new THREE.Vector2();

    this.mouseMoveSubscription;

    this.cursorPosition = { x: 0, y: 0 };

    this.setupEvents();
  }

  setupEvents() {
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

      onDown(this.canvas, () => this.dragedObject = this.getObjectOnCursor()),

      onUp(this.canvas, () => this.dragedObject = false),

      this.eventEmitter.on('onPanStart').subscribe(() => {
        this.eventEmitter.emit('isDragingObject', this.dragedObject ? this.dragedObject : false);

        if (this.dragedObject) {
          eventBus.emit('dragObjectStart', this.dragedObject.parentSceneObject.id);
          this.mouseMoveSubscription = this.eventEmitter.on('onMouseMoved').subscribe(event => {
            eventBus.emit('dragObject', event);
          });
        }
      }),

      this.eventEmitter.on('onPanEnd').subscribe(() => {
        eventBus.emit('dragObjectStop');
        if (this.mouseMoveSubscription) {
          this.mouseMoveSubscription.dispose();
          this.mouseMoveSubscription = null;
        }
      })
    ]);
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
    return scene.findObjectByRay(this.raycaster);
  }

  dispose() {
    super.dispose();
  }
}
