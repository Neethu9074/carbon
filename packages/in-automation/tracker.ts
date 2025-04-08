/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AUTOMATION_ACTION_RUN,
  AUTOMATION_ACTION_CREATE,
  AUTOMATION_ACTION_EDIT,
  AUTOMATION_ACTION_HISTORY_VIEW,
  AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW,
  AUTOMATION_POLICY_CREATE,
  AUTOMATION_POLICY_EDIT,
  AUTOMATION_OPTIMIZATION_RUN_CLICK,
  AUTOMATION_RECOMMENDED_ACTIONS_TAB_CLICK,
  AUTOMATION_TEST_ACTION_RUN,
  AUTOMATION_EXPORT_SCRIPT,
  AUTOMATION_GENERATE_AI_BUTTON_CLICK,
  AUTOMATION_CLICK_AI_GENERATED_ACTIONS_TAB,
  AUTOMATION_VIEW_AI_GENERATED_ACTION,
  AUTOMATION_ACTION_HISTORY_INSTANCE_DELETE,
  AUTOMATION_GENERATE_AI_ACTION_CLICK_PROMPT_STEP,
  AUTOMATION_AI_SELECT_NEXT_PROMPT_STEP_CLICK,
  AUTOMATION_AI_SELECT_NEXT_CUSTOMIZE_ACTION_STEP_CLICK,
  AUTOMATION_AI_ACTION_CONTENT_MODIFIED,
  AUTOMATION_AI_LEAVE_GENERATE_DIALOG,
  AUTOMATION_AI_SCRIPT_SELECT_STEP_NEXT_CLICK,
  AUTOMATION_GENERATE_AI_SCRIPT_BUTTON_CLICK_STEP2,
  AUTOMATION_AI_SCRIPT_GENERATE_STEP_NEXT_CLICK,
  AUTOMATION_AI_GOOD_FEEDBACK,
  AUTOMATION_AI_BAD_FEEDBACK,
  AUTOMATION_AI_GENERATE_STEP_ERROR,
  AUTOMATION_CLICK_EPWT_LINK
} from 'in-services/tracking/tracking';
import { CREATED_OBJECT, STARTED_PROCESS, UPDATED_OBJECT } from 'in-services/util/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

// Segment trackers
export type TrackingFunction = (optionalPayloadData?: Object) => void;
export function useSegmentTracker(): {
  createActionTrackerSegment: TrackingFunction;
  editActionTrackerSegment: TrackingFunction;
  runActionTrackerSegment: TrackingFunction;
  runOptimizationTrackerSegment: TrackingFunction;
  testActionTrackerSegment: TrackingFunction;
  exportScriptToExternalSource: TrackingFunction;
  createPolicyTrackerSegment: TrackingFunction;
  editPolicyTrackerSegment: TrackingFunction;
  actionHistoryTrackerSegment: TrackingFunction;
  actionHistoryInstanceViewTrackerSegment: TrackingFunction;
  aiGenaratedActionsTabClickTrackerSegment: TrackingFunction;
  viewAIGenaratedActionTrackerSegment: TrackingFunction;
  recommendedActionsTabClickTrackerSegment: TrackingFunction;
  actionHistoryInstanceDeleteTrackerSegment: TrackingFunction;
  generateAIButtonClickTrackerSegment: TrackingFunction;
  generateAIClickPromptStepTrackerSegment: TrackingFunction;
  selectNextPromptStepClickTrackerSegment: TrackingFunction;
  selectNextCustomizeActionStepClickTrackerSegment: TrackingFunction;
  AIActionContentModifiedTrackerSegment: TrackingFunction;
  AIActionLeaveGenerateDialogTrackerSegment: TrackingFunction;
  aiActionScriptSelectStepNextTrackerSegment: TrackingFunction;
  aiActionScriptGenerateAIButtonTrackerSegment: TrackingFunction;
  aiActionScriptGenerateStepNextClickTrackerSegment: TrackingFunction;
  aiActionGoodFeedbackTrackerSegment: TrackingFunction;
  aiActionBadFeedbackTrackerSegment: TrackingFunction;
  aiActionGenerateErrorTrackerSegment: TrackingFunction;
  clickEPWTLink: TrackingFunction;
} {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  function createActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(CREATED_OBJECT, { objectType: AUTOMATION_ACTION_CREATE }, customData);
  }

  function editActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(UPDATED_OBJECT, { objectType: AUTOMATION_ACTION_EDIT }, customData);
  }

  function runActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(STARTED_PROCESS, { processType: AUTOMATION_ACTION_RUN }, customData);
  }

  function runOptimizationTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_OPTIMIZATION_RUN_CLICK, customData);
  }

  function testActionTrackerSegment(customData?: Object): void {
    unstable_trackEvent(STARTED_PROCESS, { processType: AUTOMATION_TEST_ACTION_RUN }, customData);
  }

  function exportScriptToExternalSource(customData?: Object): void {
    unstable_trackEvent(STARTED_PROCESS, { processType: AUTOMATION_EXPORT_SCRIPT }, customData);
  }

  function createPolicyTrackerSegment(customData?: Object): void {
    unstable_trackEvent(CREATED_OBJECT, { objectType: AUTOMATION_POLICY_CREATE }, customData);
  }

  function editPolicyTrackerSegment(customData?: Object): void {
    unstable_trackEvent(UPDATED_OBJECT, { objectType: AUTOMATION_POLICY_EDIT }, customData);
  }

  function actionHistoryTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_ACTION_HISTORY_VIEW, customData);
  }
  function actionHistoryInstanceViewTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW, customData);
  }

  function aiGenaratedActionsTabClickTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_CLICK_AI_GENERATED_ACTIONS_TAB, customData);
  }

  function viewAIGenaratedActionTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_VIEW_AI_GENERATED_ACTION, customData);
  }

  function recommendedActionsTabClickTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_RECOMMENDED_ACTIONS_TAB_CLICK, customData);
  }

  function actionHistoryInstanceDeleteTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_ACTION_HISTORY_INSTANCE_DELETE, customData);
  }

  function generateAIButtonClickTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_GENERATE_AI_BUTTON_CLICK, customData);
  }

  function generateAIClickPromptStepTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_GENERATE_AI_ACTION_CLICK_PROMPT_STEP, customData);
  }

  function selectNextPromptStepClickTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_SELECT_NEXT_PROMPT_STEP_CLICK, customData);
  }

  function selectNextCustomizeActionStepClickTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_SELECT_NEXT_CUSTOMIZE_ACTION_STEP_CLICK, customData);
  }

  function AIActionContentModifiedTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_ACTION_CONTENT_MODIFIED, customData);
  }

  function AIActionLeaveGenerateDialogTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_LEAVE_GENERATE_DIALOG, customData);
  }

  function aiActionScriptSelectStepNextTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_SCRIPT_SELECT_STEP_NEXT_CLICK, customData);
  }

  function aiActionScriptGenerateAIButtonTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_GENERATE_AI_SCRIPT_BUTTON_CLICK_STEP2, customData);
  }

  function aiActionScriptGenerateStepNextClickTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_SCRIPT_GENERATE_STEP_NEXT_CLICK, customData);
  }

  function aiActionGoodFeedbackTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_GOOD_FEEDBACK, customData);
  }

  function aiActionBadFeedbackTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_BAD_FEEDBACK, customData);
  }

  function aiActionGenerateErrorTrackerSegment(customData?: Object): void {
    trackCta(AUTOMATION_AI_GENERATE_STEP_ERROR, customData);
  }

  function clickEPWTLink(customData?: Object): void {
    trackCta(AUTOMATION_CLICK_EPWT_LINK, customData);
  }

  return {
    createActionTrackerSegment,
    editActionTrackerSegment,
    runActionTrackerSegment,
    runOptimizationTrackerSegment,
    testActionTrackerSegment,
    exportScriptToExternalSource,
    createPolicyTrackerSegment,
    editPolicyTrackerSegment,
    actionHistoryTrackerSegment,
    actionHistoryInstanceViewTrackerSegment,
    aiGenaratedActionsTabClickTrackerSegment,
    viewAIGenaratedActionTrackerSegment,
    recommendedActionsTabClickTrackerSegment,
    actionHistoryInstanceDeleteTrackerSegment,
    generateAIButtonClickTrackerSegment,
    generateAIClickPromptStepTrackerSegment,
    selectNextPromptStepClickTrackerSegment,
    selectNextCustomizeActionStepClickTrackerSegment,
    AIActionContentModifiedTrackerSegment,
    AIActionLeaveGenerateDialogTrackerSegment,
    aiActionScriptSelectStepNextTrackerSegment,
    aiActionScriptGenerateAIButtonTrackerSegment,
    aiActionScriptGenerateStepNextClickTrackerSegment,
    aiActionGoodFeedbackTrackerSegment,
    aiActionBadFeedbackTrackerSegment,
    aiActionGenerateErrorTrackerSegment,
    clickEPWTLink
  };
}
