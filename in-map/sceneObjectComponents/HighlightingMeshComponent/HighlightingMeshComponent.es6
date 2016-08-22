import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/stores/factoriesStore';


export default class HighlightingMeshComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider) {
    super(sceneObject, '_highlighting');

    this.contentProvider = contentProvider;
  }

  initEvents() {
    super.initEvents();

    const factory = this.factory = getFactory('highlighting');
    const eventEmitter = this.sceneObject.eventEmitter;

    this.addSubscriptions([
      eventEmitter.on('positionChanged').subscribe(() => factory.needsUpdate()),

      eventEmitter.on('scaleChanged').subscribe(() => factory.needsUpdate()),

      eventEmitter.on('isHighlighted').distinct().subscribe(isHighlighted => {
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
  }
}
