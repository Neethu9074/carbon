import {combineLatest} from 'reactive-observables';

import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent/SceneObjectComponent';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObject';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import createFragment from 'in-map/singleMeshFactories/Fragment';
import {getFactory} from 'in-map/misc/Factories';


export default class HighlightingComponent extends SceneObjectComponent {

  constructor(sceneObject, contentProvider) {
    super(sceneObject, '_mesh');

    const factory = this.factory = getFactory('highlighting');
    const eventEmitter = sceneObject.eventEmitter;

    this.addSubscriptions([
      combineLatest([
        selectedSnapshotIdForHighlightingInMap$,
        highlightedEntityId$
      ]).subscribe(([selectedId, highlightedEntityId]) => {
        const id = sceneObject.id;
        const isHighlighted = id === selectedId || id === highlightedEntityId;

        eventEmitter.emit('isHighlighted', isHighlighted);
      }),

      eventEmitter.on('positionChanged').merge(
      eventEmitter.on('scaleChanged')).subscribe(() => factory.needsUpdate()),

      eventEmitter.on('isHighlighted').distinct().subscribe(isHighlighted => {
        isHighlighted
          ? factory.add(createFragment(this.id, sceneObject, contentProvider))
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
