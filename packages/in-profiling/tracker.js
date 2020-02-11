import {
  track,
  PROFILING_CPU_TREEVIEW_OPENEND,
  PROFILING_CPU_FLAMEGRAPH_OPENEND,
  PROFILING_WAITTIME_TREEVIEW_OPENEND,
  PROFILING_WAITTIME_FLAMEGRAPH_OPENEND,
  PROFILING_TREEVIEW_EXPANDED,
  PROFILING_FLAMEGRAPH_CLICKED
} from 'in-services/tracking/tracking';

export const cpuTreeViewOpened = () => track(PROFILING_CPU_TREEVIEW_OPENEND);
export const cpuFlameGraphOpened = () => track(PROFILING_CPU_FLAMEGRAPH_OPENEND);
export const waitTimeTreeViewOpened = () => track(PROFILING_WAITTIME_TREEVIEW_OPENEND);
export const waitTimeFlameGraphOpened = () => track(PROFILING_WAITTIME_FLAMEGRAPH_OPENEND);

export const treeViewExpanded = depth => track(PROFILING_TREEVIEW_EXPANDED, { depth });
export const flameGraphClicked = depth => track(PROFILING_FLAMEGRAPH_CLICKED, { depth });
