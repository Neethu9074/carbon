import Decorator from 'in-map/misc/common/cameraController/decorator/Decorator';
import { onDown } from 'in-services/reactiveMouseEvents';
import { eventBus } from 'in-map/services/eventBus';

export default class DragAndDropDecorator extends Decorator {
  constructor(controller, canvas) {
    super(controller);

    this.mouseMoveSubscription = undefined;
    this.dragedObjectId = undefined;
    this.canvas = canvas;
  }

  init() {
    super.init();
  }

  initEvents() {
    super.initEvents();

    this.addSubscriptions([
      onDown(this.canvas, () => {
        const { hittenObject } = this.cameraController.getObjectOnCursor();
        this.dragedObjectId = hittenObject ? hittenObject.parentSceneObject.id : null;
      }),
      this.eventEmitter.on('onPanStart').subscribe(() => {
        this.eventEmitter.emit('isDragingObject', this.dragedObjectId ? this.dragedObjectId : false);

        if (this.dragedObjectId) {
          eventBus.emit('dragObjectStart', this.dragedObjectId);
          this.mouseMoveSubscription = this.eventEmitter.on('onMouseMoved').subscribe(() => {
            const pointOfImpact = this.cameraController.getPointOfImpact();
            if (pointOfImpact) {
              eventBus.emit('dragObject', pointOfImpact);
            }
          });
        }
      }),
      this.eventEmitter.on('onPanEnd').subscribe(() => {
        this.disposeMouseMoveSubscription();

        eventBus.emit('dragObjectStart', null);
        eventBus.emit('dragObjectStop', this.dragedObjectId);

        this.dragedObjectId = null;
      })
    ]);
  }

  disposeMouseMoveSubscription() {
    if (this.mouseMoveSubscription) {
      this.mouseMoveSubscription.dispose();
      this.mouseMoveSubscription = null;
    }
  }

  dispose() {
    this.disposeMouseMoveSubscription();

    super.dispose();

    this.canvas = null;
  }
}
