import {combineLatest} from 'reactive-observables';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObject';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/misc/Factories';


export default class HighlightingComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider) {
    super(sceneObject, '_mesh');

    this.contentProvider = contentProvider;
  }

  initEvents() {
    super.initEvents();

    const factory = this.factory = getFactory('highlighting');
    const sceneObject = this.sceneObject;
    const eventEmitter = this.sceneObject.eventEmitter;

    this.addSubscriptions([
      combineLatest([
        selectedSnapshotIdForHighlightingInMap$,
        highlightedEntityId$
      ]).subscribe(([selectedId, highlightedEntityId]) => {
        const id = sceneObject.id;
        const isHighlighted = id === selectedId || id === highlightedEntityId;

        eventEmitter.emit('isHighlighted', isHighlighted);
      }),

      eventEmitter.on('positionChanged').subscribe(() => factory.needsUpdate()),

      eventEmitter.on('scaleChanged').subscribe(() => factory.needsUpdate()),

      eventEmitter.on('isHighlighted').distinct().subscribe(isHighlighted => {
        isHighlighted
          ? factory.add(createFragment(this.id, sceneObject, this.contentProvider))
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
