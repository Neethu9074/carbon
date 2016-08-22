import {combineLatest} from 'reactive-observables';

import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';


export default class HighlightingComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_highlighting');
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      combineLatest([
        selectedSnapshotIdForHighlightingInMap$,
        highlightedEntityId$
      ]).subscribe(([selectedId, highlightedEntityId]) => {
        const id = this.sceneObject.id;
        const isHighlighted = id === selectedId || id === highlightedEntityId;
        this.emitToClient('isHighlighted', isHighlighted);
      })
    );
  }

  dispose() {
    super.dispose();
  }
}
