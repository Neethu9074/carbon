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
  CLICK_TURBO_LINK_FOR_DETAILS,
  EXECUTE_TURBO_ACTION
} from 'in-services/tracking/tracking';

export const runActionTracker = (e: Object) => track(AUTOMATION_ACTION_RUN, e);
export const createActionTracker = (e: Object) => track(AUTOMATION_ACTION_CREATE, e);
export const editActionTracker = (e: Object) => track(AUTOMATION_ACTION_EDIT, e);
export const deleteActionTracker = (e: Object) => track(AUTOMATION_ACTION_DELETE, e);
export const actionHistoryTracker = () => track(AUTOMATION_ACTION_HISTORY_VIEW);
export const actionHistoryInstanceViewTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW, e);
export const actionHistoryInstanceFeedbackTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND, e);
export const createPolicyTracker = (e: Object) => track(AUTOMATION_POLICY_CREATE, e);
export const createBulkPoliciesTracker = (e: Object) => track(AUTOMATION_POLICY_CREATE, e);
export const editPolicyTracker = (e: Object) => track(AUTOMATION_POLICY_EDIT, e);
export const clickTurboLinkForDetailsTracker = (e: Object) => track(CLICK_TURBO_LINK_FOR_DETAILS, e);
export const viewTurboActionTracker = (e: Object) => track(EXECUTE_TURBO_ACTION, e);
