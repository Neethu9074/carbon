import {combineLatest} from 'reactive-observables';

import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {setIds, clearIds} from 'in-map/stores/logical/connectedHighlightingStore';
import {highlightedEntityId$} from 'in-services/stores/highlightedEntityId';
import {CONNECTED_HIGHLIGHTING_CHECK} from 'in-map/misc/TimingConfig';
import connections from 'in-map/stores/connectionsStore';


export default class ConnectedNodesHighlighter {
  constructor() {}

  initEvents() {
    this.highlightingSubscription = combineLatest([
      selectedSnapshotIdForHighlightingInMap$,
      highlightedEntityId$,
      connections.stream
    ])
    .throttle(CONNECTED_HIGHLIGHTING_CHECK)
    .subscribe(([selectedId, highlightedEntityId, connections]) => {
      if (!highlightedEntityId && !selectedId) {
        clearIds();
        return;
      }

      const connectionList = Object.keys(connections).map(key => connections[key]);
      const idsToHighlight = {};
      for (let i = 0, length = connectionList.length; i < length; i++) {
        const connection = connectionList[i];
        if (connection.sourceNode.id === highlightedEntityId || connection.destinationNode.id === highlightedEntityId ||
            connection.sourceNode.id === selectedId || connection.destinationNode.id === selectedId) {
          idsToHighlight[connection.id] = true;
          idsToHighlight[connection.sourceNode.id] = true;
          idsToHighlight[connection.destinationNode.id] = true;
        }
      }

      setIds(idsToHighlight);
    });
  }

  disposeSubscription() {
    if (this.highlightingSubscription) {
      this.highlightingSubscription.dispose();
      this.highlightingSubscription = null;
    }
  }

  dispose() {
    this.disposeSubscription();
    clearIds();
  }
}
