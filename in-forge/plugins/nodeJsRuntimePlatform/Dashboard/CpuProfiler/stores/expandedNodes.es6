import { createStore } from 'in-stores/store';

const expandedNodesStore = createStore({
  name: 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/stores/expandedNodes/expandedNodes',
  initialValue: new Map()
});
export const expandedNodes$ = expandedNodesStore.observable;

export function toggleExpandedNode(nodeId) {
  expandedNodesStore.applyStateMutation(expanded => {
    if (expanded.has(nodeId)) {
      expanded.delete(nodeId);
    } else {
      expanded.set(nodeId, true);
    }
    return expanded;
  });
}

export function clearExpansionState() {
  expandedNodesStore.applyStateMutation(expanded => {
    expanded.clear();
    return expanded;
  });
}

export function collapseNode(nodeId) {
  expandedNodesStore.applyStateMutation(expanded => {
    expanded.delete(nodeId);
    return expanded;
  });
}

export function expandNode(nodeId) {
  expandedNodesStore.applyStateMutation(expanded => {
    expanded.set(nodeId, true);
    return expanded;
  });
}
