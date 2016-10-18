import {createStore} from 'in-stores/store';

const selectedNodeStore = createStore({
  name: 'in-forge/plugins/rubyRuntimePlatform/Dashboard/CpuProfiler/stores/selectedNode/selectedNode',
  initialValue: null
});
export const selectedNode$ = selectedNodeStore.observable;

export function setSelectedNode(node) {
  selectedNodeStore.applyStateMutation(previousNode => {
    if (previousNode === node) {
      return null;
    }
    return node;
  });
}

export function clearSelectedNode() {
  selectedNodeStore.mutateTo(null);
}
