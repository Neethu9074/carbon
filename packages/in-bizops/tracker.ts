/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  BIZOPS_PROCESSES_TABS_CLICK,
  BIZOPS_PROCESSES_LIST_SELECT,
  BIZOPS_PROCESS_TABS_CLICK,
  BIZOPS_PROCESS_ANALYZEINSTANCES_CLICK,
  BIZOPS_PROCESS_ACTIVITIES_ALL_CLICK,
  BIZOPS_PROCESS_ACTIVITIES_SELECT,
  BIZOPS_PROCESS_ACTIVITY_TABS_CLICK,
  BIZOPS_PROCESS_ACTIVITY_PROCESS_CONTEXT_CLICK
} from 'in-services/tracking/tracking';

interface TabTrackerProps {
  tab: string;
}

interface ProcessTrackerProps {
  processId: string;
  processName: string;
}

interface ActivityTrackerProps {
  processId: string;
  processName: string;
  activityName: string;
}

export const clickBizopsProcessesTabsTracker = (e: TabTrackerProps) => track(BIZOPS_PROCESSES_TABS_CLICK, e);
export const selectBizopsListProcessTracker = (e: ProcessTrackerProps) => track(BIZOPS_PROCESSES_LIST_SELECT, e);

export const clickBizopsProcessTabsTracker = (e: TabTrackerProps) => track(BIZOPS_PROCESS_TABS_CLICK, e);
export const clickBizopsProcessAnalyzeInstancesTracker = (e: ActivityTrackerProps) =>
  track(BIZOPS_PROCESS_ANALYZEINSTANCES_CLICK, e);
export const clickBizopsProcessViewAllActivitiesTracker = (e: ProcessTrackerProps) =>
  track(BIZOPS_PROCESS_ACTIVITIES_ALL_CLICK, e);
export const selectBizopsProcessActivitiesTracker = (e: ActivityTrackerProps) =>
  track(BIZOPS_PROCESS_ACTIVITIES_SELECT, e);

export const clickBizopsProcessActivityTabsTracker = (e: TabTrackerProps) =>
  track(BIZOPS_PROCESS_ACTIVITY_TABS_CLICK, e);
export const clickBizopsActivityProcessContextTracker = (e: ActivityTrackerProps) =>
  track(BIZOPS_PROCESS_ACTIVITY_PROCESS_CONTEXT_CLICK, e);
