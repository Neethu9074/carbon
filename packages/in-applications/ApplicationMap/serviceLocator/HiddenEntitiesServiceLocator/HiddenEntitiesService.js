import { combineLatest, create } from '@instana/observables';

import { SIGNALS } from 'in-applications/ApplicationMap/serviceLocator/EventBusServiceLocator/EventBusService';
import { containsIgnoreCase } from 'in-services/util/string';

export default function createHiddenEntitiesService(
  eventBusServiceLocator,
  nodesServiceLocator,
  connectionsServiceLocator
) {
  let resolvedIds = new Map();
  let hoveredNodeId$ = create();
  let selectedNodeId$ = create();

  let resolvedIds$ = combineLatest([
    eventBusServiceLocator.on(SIGNALS.SEARCH).startWith(''),
    hoveredNodeId$.startWith(null).distinct(),
    selectedNodeId$.startWith(null).distinct(),
    nodesServiceLocator.getNodes().stream,
    connectionsServiceLocator.getConnections$()
  ])
    .debounce(200)
    .map(([searchQuery, hoveredNodeId, selectedNodeId, nodes, connections]) => {
      const leadingId = hoveredNodeId || selectedNodeId;
      resolvedIds.clear();

      // case 1 - no filter is defined
      if (!searchQuery && !leadingId) {
        return resolvedIds;
      }

      // case 2 - hovering goes over search
      if (leadingId) {
        const nodeIds = nodes.keys();
        for (const id of nodeIds) {
          resolvedIds.set(id, true);
        }

        resolvedIds.delete(leadingId);

        const connectionsIterator = connections.values();
        for (const connection of connectionsIterator) {
          const { from, to } = connection;
          if (leadingId === from.id || leadingId === to.id) {
            resolvedIds.delete(from.id);
            resolvedIds.delete(to.id);
          } else {
            resolvedIds.set(connection.id);
          }
        }

        return resolvedIds;
      }

      // case 3 - user is searching
      if (searchQuery) {
        const nodeValues = nodes.values();
        for (const node of nodeValues) {
          if (!containsIgnoreCase(node.data.label, searchQuery)) {
            resolvedIds.set(node.id, true);
          }
        }
      }
      return resolvedIds;
    });

  function setHoveredNodeId(id) {
    hoveredNodeId$.emit(id);
  }

  function setSelectedNodeId(id) {
    selectedNodeId$.emit(id);
  }

  function getResolvedId$() {
    return resolvedIds$;
  }

  function dispose() {
    resolvedIds.clear();
    resolvedIds$ = null;

    hoveredNodeId$ = null;
    selectedNodeId$ = null;
  }

  return {
    setHoveredNodeId,
    setSelectedNodeId,
    getResolvedId$,
    dispose
  };
}
