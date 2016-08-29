import {LineBasicMaterial, BufferGeometry, Line} from 'in-map/3DLibProvider';
import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {updateAttribute} from 'in-map/services/geometryAttributes';
import {eventBus} from 'in-map/services/eventBus';


const GHOST_MATERIAL = new LineBasicMaterial({
  color: 0x627379,
  linewidth: navigator.platform.indexOf('Win') < 0 ? 2 : 1
});

export default class DragConnection {
  constructor(fromPosition) {
    const geometry = new BufferGeometry();
    const sceneObject = this.sceneObject = new Line(geometry, GHOST_MATERIAL);

    addSceneObject(sceneObject);

    this.dragObjectSubscription =  eventBus.on('dragObject').subscribe(newPos =>
      updateAttribute(geometry, 'position', [
        fromPosition.x, fromPosition.y, fromPosition.z,
        newPos.x, newPos.y, newPos.z
      ])
    );
  }

  dispose() {
    this.dragObjectSubscription.dispose();

    removeSceneObject(this.sceneObject);

    this.sceneObject.geometry.dispose();
    this.sceneObject = null;
  }
}
