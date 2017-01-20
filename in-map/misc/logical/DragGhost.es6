import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {Mesh, MeshBasicMaterial, Vector3} from 'in-map/3DLibProvider';
import {requestRendering} from 'in-map/stores/renderingStore';
import ghosts from 'in-map/stores/logical/ghostsStore';
import {eventBus} from 'in-map/services/eventBus';


const GHOST_MATERIAL = new MeshBasicMaterial({
  transparent: true,
  opacity: 0.25
});

export default class DragGhost {
  constructor(parent, ghostGeometry) {
    this.originalId = parent.id;
    this.currentPosition = new Vector3();

    const sceneObject = this.sceneObject = new Mesh(
      ghostGeometry,
      GHOST_MATERIAL
    );
    addSceneObject(sceneObject);
    ghosts.add(this.originalId);

    this.dragObjectSubscription = eventBus.on('dragObject').subscribe(newPos => {
      this.currentPosition.copy(newPos);
      this.sceneObject.position.copy(newPos);
      requestRendering();
    });
  }

  setScale(scale) {
    this.sceneObject.scale.set(scale.x, scale.y, scale.z);
  }

  getCurrentPosition() {
    return this.currentPosition;
  }

  dispose() {
    this.dragObjectSubscription.dispose();

    removeSceneObject(this.sceneObject);
    ghosts.remove(this.originalId);

    this.sceneObject.geometry.dispose();
    this.sceneObject = null;

    this.currentPosition = null;
    this.originalId = null;
  }
}
