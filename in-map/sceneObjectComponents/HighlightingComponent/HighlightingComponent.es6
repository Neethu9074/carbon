import {combineLatest} from 'reactive-observables';

import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {connectedHighlightedIds$} from 'in-map/stores/logical/connectedHighlightingStore';
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import {highlightedEntityIds$} from 'in-stores/highlightedEntityIds';


export default class HighlightingComponent extends SceneObjectComponent {

  constructor(sceneObject) {
    super(sceneObject, '_highlighting');
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(
      combineLatest([
        selectedSnapshotIdForHighlightingInMap$,
        connectedHighlightedIds$,
        highlightedEntityId$,
        highlightedEntityIds$
      ]).subscribe(([selectedId, connectedHighlightedIds, highlightedEntityId, highlightedEntityIds]) => {
        const id = this.sceneObject.id;
        const isHighlighted = (id === selectedId ||
                               id === highlightedEntityId ||
                               highlightedEntityIds.indexOf(id) >= 0 ||
                               connectedHighlightedIds[id] === true);
        this.emitToClient('isHighlighted', isHighlighted);
      })
    );
  }

  dispose() {
    super.dispose();
  }
}
