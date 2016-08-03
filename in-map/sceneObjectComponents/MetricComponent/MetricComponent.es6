import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/misc/Factories';


export default class MetricComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider, factoryId) {
    super(sceneObject, '_mesh');

    this.factory = getFactory(factoryId);
    this.fragment = createFragment(this.id, sceneObject, contentProvider);
    this.factory.add(this.fragment);

    this.addSubscriptions([
      sceneObject.eventEmitter.on('positionChanged').subscribe(() => this.factory.needsUpdate()),
      sceneObject.eventEmitter.on('scaleChanged').subscribe(() => this.factory.needsUpdate()),
      sceneObject.eventEmitter.on('colorChanged').subscribe(() => this.factory.needsUpdate())
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
