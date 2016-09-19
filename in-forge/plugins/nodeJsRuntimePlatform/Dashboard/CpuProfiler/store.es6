import {clearExpansionState} from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/stores/expandedNodes';
import subscribeToAgentResponse from 'in-services/subscription/agentResponse';
import {selectedSnapshotId$} from 'in-stores/snapshot';
import {createStore} from 'in-stores/store';

let nodeIdCounter = 0;

let lastProfilingSubscription;
let lastProfilingSnapshot;

const lastProfilingResultStore = createStore({
  name: 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store/lastProfilingResult',
  initialValue: null
});
export const lastProfilingResult$ = lastProfilingResultStore.observable;


const isProfilingStore = createStore({
  name: 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/CpuProfiler/store/isProfiling',
  initialValue: null
});
export const isProfiling$ = isProfilingStore.observable;

selectedSnapshotId$.subscribe(stopProfiling);

export function startProfiling(snapshot, duration) {
  stopProfiling();

  isProfilingStore.mutateTo(true);
  lastProfilingSnapshot = snapshot;
  lastProfilingSubscription = subscribeToAgentResponse({
    action: 'node.startCpuProfiling',
    target: snapshot.get('volatileId'),
    args: {
      duration: duration
    }
  }).subscribe(response => {
    const dataIsString = typeof response.data === 'string';
    if (!dataIsString && response.data) {
      addIdsToAllNodes(response.data);
    }
    lastProfilingResultStore.mutateTo(response);
    isProfilingStore.mutateTo(dataIsString);
  });
}


export function stopProfiling() {
  lastProfilingResultStore.mutateTo(null);
  isProfilingStore.mutateTo(false);
  clearExpansionState();

  if (lastProfilingSubscription) {
    lastProfilingSubscription.dispose();
    lastProfilingSubscription = null;
  }

  if (lastProfilingSnapshot) {
    subscribeToAgentResponse({
      action: 'node.stopCpuProfiling',
      target: lastProfilingSnapshot.get('volatileId'),
      args: {
        abort: true
      }
    }).once(() => {});
    lastProfilingSnapshot = null;
  }
}


function addIdsToAllNodes(node) {
  node.id = nodeIdCounter++;
  node.c.forEach(addIdsToAllNodes);
}
