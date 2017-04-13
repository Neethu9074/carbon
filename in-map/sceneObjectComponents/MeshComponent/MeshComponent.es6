import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/stores/factoriesStore';


export default class MeshComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider, factoryId) {
    super(sceneObject, '_mesh');

    this.factory = getFactory(factoryId);
    this.fragment = createFragment(this.id, sceneObject, contentProvider);
    this.factory.add(this.fragment);
  }

  initEvents() {
    super.initEvents();

    const eventEmitter = this.sceneObject.eventEmitter;

    this.addSubscriptions([
      eventEmitter.on('transformationChanged').subscribe(() => this.factory.needsUpdate()),
      eventEmitter.on('colorChanged').subscribe(() => this.factory.needsUpdate())
    ]);
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();

    this.fragment = null;
    this.factory = null;
  }
}
