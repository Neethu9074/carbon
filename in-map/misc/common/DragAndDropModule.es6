import {onDown} from 'in-services/reactiveMouseEvents';
import {eventBus} from 'in-map/services/eventBus';
import Module from 'in-map/misc/common/Module';


export default class RaycasterModule extends Module {

  constructor(params) {
    super(params);

    this.dragedObjectId = false;

    this.mouseMoveSubscription;

    this.initEvents();
  }

  initEvents() {
    this.addSubscriptions([
      onDown(this.canvas, () => {
        const {hittenObject} = this.client.interactionModules.get('raycaster').getObjectOnCursor();
        this.dragedObjectId = hittenObject ? hittenObject.parentSceneObject.id : null;
      }),

      this.eventEmitter.on('onPanStart').subscribe(() => {
        this.eventEmitter.emit('isDragingObject', this.dragedObjectId ? this.dragedObjectId : false);

        if (this.dragedObjectId) {
          eventBus.emit('dragObjectStart', this.dragedObjectId);
          this.mouseMoveSubscription = this.eventEmitter.on('onMouseMoved').subscribe(() => {
            const pointOfImpact = this.client.getPointOfImpact();
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

  dispose() {
    super.dispose();
  }
}
