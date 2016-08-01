import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/misc/Factories';


export default class MeshComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider, factoryId) {
    super(sceneObject, '_mesh');

    this.factory = getFactory(factoryId);
    this.fragment = createFragment(this.id, sceneObject, contentProvider);
    this.factory.add(this.fragment);

    this.addSubscription(
      sceneObject.eventEmitter.on('positionChanged').merge(
      sceneObject.eventEmitter.on('scaleChanged')).subscribe(() => {
        this.factory.needsUpdate();
      })
    );
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();

    this.fragment = null;
    this.factory = null;
  }
}
