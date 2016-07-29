import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/misc/Factories';


export default class MeshComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider, factoryId) {
    super(sceneObject, '_mesh');

    this.factory = getFactory(factoryId);
    if (this.factory) {
      this.fragment = createFragment(this.id, sceneObject, contentProvider);
      this.factory.add(this.fragment);
    }

    sceneObject.eventEmitter.on('positionChanged').subscribe(() => {
      if (this.factory) {
        this.factory.needsUpdate();
      }
    });
  }

  dispose() {
    super.dispose();

    if (this.factory) {
      this.factory.remove(this.id);
    }

    this.position = null;
    this.scale = null;
  }
}
