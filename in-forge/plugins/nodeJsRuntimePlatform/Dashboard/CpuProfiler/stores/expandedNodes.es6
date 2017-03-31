import { createStore } from 'in-stores/store';

const expandedNodesStore = createStore({
  name: 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/stores/expandedNodes/expandedNodes',
  initialValue: {}
});
export const expandedNodes$ = expandedNodesStore.observable;

export function toggleExpandedNode(nodeId) {
  expandedNodesStore.applyStateMutation(expanded => {
    if (expanded[nodeId]) {
      delete expanded[nodeId];
    } else {
      expanded[nodeId] = true;
    }
    return expanded;
  });
}

export function clearExpansionState() {
  expandedNodesStore.mutateTo({});
}

export function collapseNode(nodeId) {
  expandedNodesStore.applyStateMutation(expanded => {
    delete expanded[nodeId];
    return expanded;
  });
}

export function expandNode(nodeId) {
  expandedNodesStore.applyStateMutation(expanded => {
    expanded[nodeId] = true;
    return expanded;
  });
}
