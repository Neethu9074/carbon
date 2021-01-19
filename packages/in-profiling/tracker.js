/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  track,
  PROFILING_CPU_TREEVIEW_OPENEND,
  PROFILING_CPU_FLAMEGRAPH_OPENEND,
  PROFILING_MEMORY_TREEVIEW_OPENEND,
  PROFILING_MEMORY_FLAMEGRAPH_OPENEND,
  PROFILING_WAITTIME_TREEVIEW_OPENEND,
  PROFILING_WAITTIME_FLAMEGRAPH_OPENEND,
  PROFILING_TREEVIEW_EXPANDED,
  PROFILING_OVERVIEW_OPENED
} from 'in-services/tracking/tracking';

export const cpuTreeViewOpened = profileEntityTechnology =>
  track(PROFILING_CPU_TREEVIEW_OPENEND, { profileEntityTechnology });
export const cpuFlameGraphOpened = profileEntityTechnology =>
  track(PROFILING_CPU_FLAMEGRAPH_OPENEND, { profileEntityTechnology });
export const waitTimeTreeViewOpened = profileEntityTechnology =>
  track(PROFILING_WAITTIME_TREEVIEW_OPENEND, { profileEntityTechnology });
export const waitTimeFlameGraphOpened = profileEntityTechnology =>
  track(PROFILING_WAITTIME_FLAMEGRAPH_OPENEND, { profileEntityTechnology });
export const memoryTreeViewOpened = profileEntityTechnology =>
  track(PROFILING_MEMORY_TREEVIEW_OPENEND, { profileEntityTechnology });
export const memoryFlameGraphOpened = profileEntityTechnology =>
  track(PROFILING_MEMORY_FLAMEGRAPH_OPENEND, { profileEntityTechnology });

export const treeViewExpanded = (depth, profileEntityTechnology) =>
  track(PROFILING_TREEVIEW_EXPANDED, { depth, profileEntityTechnology });

export const overviewOpened = profileEntityTechnology => track(PROFILING_OVERVIEW_OPENED, { profileEntityTechnology });
