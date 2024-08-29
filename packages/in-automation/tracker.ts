/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  AUTOMATION_ACTION_RUN,
  AUTOMATION_ACTION_CREATE,
  AUTOMATION_ACTION_EDIT,
  AUTOMATION_ACTION_DELETE,
  AUTOMATION_ACTION_HISTORY_VIEW,
  AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW,
  AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND,
  AUTOMATION_POLICY_CREATE,
  AUTOMATION_POLICY_EDIT,
  AUTOMATION_CLICK_TURBO_LINK_FOR_DETAILS,
  AUTOMATION_VIEW_TURBO_ACTION,
  AUTOMATION_RECOMMENDED_ACTIONS_TAB_CLICK,
  AUTOMATION_CREATE_POLICY_FROM_RECOMMENDED_ACTIONS,
  AUTOMATION_TEST_ACTION_RUN,
  AUTOMATION_POLICY_BULK_CREATE,
  AUTOMATION_GENERATE_AI_BUTTON_CLICK,
  AUTOMATION_CREATE_AI_ACTION_POLICY,
  AUTOMATION_CLICK_AI_GENERATED_ACTIONS_TAB,
  AUTOMATION_COPY_AI_GENERATED_ACTION,
  AUTOMATION_VIEW_AI_GENERATED_ACTION,
  AUTOMATION_TEST_AI_GENERATED_ACTION,
  AUTOMATION_CLICK_COPY_AI_GENERATED_ACTION,
  AUTOMATION_CLICK_TEST_AI_GENERATED_ACTION,
  AUTOMATION_ACTION_HISTORY_INSTANCE_DELETE
} from 'in-services/tracking/tracking';
import { CREATED_OBJECT, STARTED_PROCESS, UPDATED_OBJECT } from 'in-services/util/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

export const runActionTracker = (e: Object) => track(AUTOMATION_ACTION_RUN, e);
export const createActionTracker = (e: Object) => track(AUTOMATION_ACTION_CREATE, e);
export const editActionTracker = (e: Object) => track(AUTOMATION_ACTION_EDIT, e);
export const deleteActionTracker = (e: Object) => track(AUTOMATION_ACTION_DELETE, e);
export const actionHistoryTracker = () => track(AUTOMATION_ACTION_HISTORY_VIEW);
export const actionHistoryInstanceViewTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW, e);
export const actionHistoryInstanceDeleteTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_INSTANCE_DELETE, e);
export const actionHistoryInstanceFeedbackTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND, e);
export const createPolicyTracker = (e: Object) => track(AUTOMATION_POLICY_CREATE, e);
export const createBulkPoliciesTracker = (e: Object) => track(AUTOMATION_POLICY_BULK_CREATE, e);
export const editPolicyTracker = (e: Object) => track(AUTOMATION_POLICY_EDIT, e);
export const recommendedActionsTabClickTracker = () => track(AUTOMATION_RECOMMENDED_ACTIONS_TAB_CLICK);
export const createPolicyFromRecommendedActionsTracker = (e: Object) =>
  track(AUTOMATION_CREATE_POLICY_FROM_RECOMMENDED_ACTIONS, e);
export const testActionTracker = (e: Object) => track(AUTOMATION_TEST_ACTION_RUN, e);

//AI trackers
export const generateAIButtonClickTracker = (e: Object) => track(AUTOMATION_GENERATE_AI_BUTTON_CLICK, e);
export const createPolicyFromAIActionTracker = (e: Object) => track(AUTOMATION_CREATE_AI_ACTION_POLICY, e);
export const aiGenaratedActionsTabClickTracker = () => track(AUTOMATION_CLICK_AI_GENERATED_ACTIONS_TAB);
export const copyAIGenaratedActionTracker = (e: object) => track(AUTOMATION_COPY_AI_GENERATED_ACTION, e);
export const viewAIGenaratedActionTracker = (e: object) => track(AUTOMATION_VIEW_AI_GENERATED_ACTION, e);
export const testAIGenaratedActionTracker = (e: object) => track(AUTOMATION_TEST_AI_GENERATED_ACTION, e);
export const clickCopyAIGenaratedActionTracker = (e: object) => track(AUTOMATION_CLICK_COPY_AI_GENERATED_ACTION, e);
export const clickTestAIGenaratedActionTracker = (e: object) => track(AUTOMATION_CLICK_TEST_AI_GENERATED_ACTION, e);

//turbo trackers
export const clickTurboLinkForDetailsTracker = (e: Object) => track(AUTOMATION_CLICK_TURBO_LINK_FOR_DETAILS, e);
export const viewTurboActionTracker = (e: Object) => track(AUTOMATION_VIEW_TURBO_ACTION, e);

// Segment trackers
export type TrackingFunction = (optionalPayloadData?: Object) => void;
export function useSegmentTracker(): {
  createActionTrackerSegment: TrackingFunction;
  editActionTrackerSegment: TrackingFunction;
  runActionTrackerSegment: TrackingFunction;
  testActionTrackerSegment: TrackingFunction;
  createPolicyTrackerSegment: TrackingFunction;
  editPolicyTrackerSegment: TrackingFunction;
} {
  const { unstable_trackEvent } = useSegmentTracking();

  function createActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(CREATED_OBJECT, { objectType: AUTOMATION_ACTION_CREATE }, customData);
  }

  function editActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(UPDATED_OBJECT, { objectType: AUTOMATION_ACTION_EDIT }, customData);
  }

  function runActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(STARTED_PROCESS, { processType: AUTOMATION_ACTION_RUN }, customData);
  }

  function testActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(STARTED_PROCESS, { processType: AUTOMATION_TEST_ACTION_RUN }, customData);
  }

  function createPolicyTrackerSegment(customData?: Object): void {
    unstable_trackEvent(CREATED_OBJECT, { objectType: AUTOMATION_POLICY_CREATE }, customData);
  }

  function editPolicyTrackerSegment(customData?: Object): void {
    unstable_trackEvent(UPDATED_OBJECT, { objectType: AUTOMATION_POLICY_EDIT }, customData);
  }

  return {
    createActionTrackerSegment,
    editActionTrackerSegment,
    runActionTrackerSegment,
    testActionTrackerSegment,
    createPolicyTrackerSegment,
    editPolicyTrackerSegment
  };
}
