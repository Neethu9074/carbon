import {create} from 'reactive-observables';

import {clearExpansionState} from 'in-forge/plugins/rubyRuntimePlatform/Dashboard/CpuProfiler/stores/expandedNodes';
import subscribeToAgentResponse from 'in-services/subscription/agentResponse';
import {selectedSnapshotId$} from 'in-stores/snapshot';
import {createStore} from 'in-stores/store';

let nodeIdCounter = 0;

let lastProfilingSubscription;
let lastProfilingSnapshot;

export const lastProfilingResult$ = create().emit(null);


const isProfilingStore = createStore({
  name: 'in-forge/plugins/rubyRuntimePlatform/Dashboard/CpuProfiler/store/isProfiling',
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
      processProfile(response.data);
    }
    lastProfilingResult$.emit(response);
    isProfilingStore.mutateTo(dataIsString);
  });
}


export function stopProfiling() {
  lastProfilingResult$.emit(null);
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


function processProfile(node, parent, indexInParent) {
  node.id = String(nodeIdCounter++);
  node.parent = parent;
  node.indexInParent = indexInParent;
  node.c.sort((a, b) => {
    const c = a.t - b.t;
    if (c !== 0) {
      return c;
    }
    return a.f.localeCompare(b.f);
  });
  node.c.reverse();
  node.c.forEach((c, i) => processProfile(c, node, i));
}
