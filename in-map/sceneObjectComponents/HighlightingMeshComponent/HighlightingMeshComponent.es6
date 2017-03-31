import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import { getFactory } from 'in-map/stores/factoriesStore';

export default class HighlightingMeshComponent extends SceneObjectComponent {
  constructor(sceneObject, contentProvider, factoryId = 'highlighting', eventToListen = 'isHighlighted') {
    super(sceneObject, '_highlighting');

    this.contentProvider = contentProvider;
    this.eventToListen = eventToListen;
    this.factoryId = factoryId;
  }

  initEvents() {
    super.initEvents();

    const factory = (this.factory = getFactory(this.factoryId));
    const eventEmitter = this.sceneObject.eventEmitter;

    this.addSubscriptions([
      eventEmitter.on('positionChanged').subscribe(() => factory.needsUpdate()),
      eventEmitter.on('scaleChanged').subscribe(() => factory.needsUpdate()),
      eventEmitter.on(this.eventToListen).distinct().subscribe(isHighlighted => {
        isHighlighted
          ? factory.add(createFragment(this.id, this.sceneObject, this.contentProvider))
          : factory.remove(this.id);
        factory.needsUpdate();
      })
    ]);
  }

  dispose() {
    super.dispose();

    this.factory.remove(this.id);
    this.factory.needsUpdate();
    this.factory = null;

    this.contentProvider = null;
    this.eventToListen = null;
    this.factoryId = null;
  }
}
