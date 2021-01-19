/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { combineLatest } from '@instana/observables';

import { selectedSnapshotIdForHighlightingInMap$ } from 'in-map/stores/selectedMapSceneObjectStore';
import SceneObjectComponent from 'in-map/sceneObjectComponents/SceneObjectComponent';
import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { highlightedEntityIds$ } from 'in-stores/highlightedEntityIds';

export default class HighlightingComponent extends SceneObjectComponent {
  constructor(sceneObject) {
    super(sceneObject, '_highlighting');
  }

  initEvents() {
    super.initEvents();

    const highlightingChangedCallback = this.highlightingChanged.bind(this);

    this.addSubscriptions([
      combineLatest([selectedSnapshotIdForHighlightingInMap$, highlightedEntityId$, highlightedEntityIds$]).subscribe(
        highlightingChangedCallback
      )
    ]);
  }

  highlightingChanged([selectedId, highlightedEntityId, highlightedEntityIds]) {
    const id = this.sceneObject.id;
    const isHighlighted = id === selectedId || id === highlightedEntityId || highlightedEntityIds.indexOf(id) >= 0;
    this.emitToClient('isHighlighted', isHighlighted);
  }

  connectedHighlightingChanged(connectedHighlightedIds) {
    const id = this.sceneObject.id;
    const isHighlighted = connectedHighlightedIds[id] === true;
    this.emitToClient('isSecondaryHighlighted', isHighlighted);
  }

  dispose() {
    super.dispose();
  }
}
