/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  REMEDIATION_ASSOCIATE_ACTION,
  REMEDIATION_RUN_ACTION,
  SETTINGS_AUTOMATION_ACTION_CREATE,
  SETTINGS_AUTOMATION_ACTION_EDIT,
  SETTINGS_AUTOMATION_ACTION_DELETE,
  AUTOMATION_ACTION_HISTORY_VIEW,
  AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW,
  AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND,
  DELETE_ASSOCIATE_ACTION,
  DELETE_ASSOCIATE_ACTION_APP_ALERT,
  CREATE_AUTOMATION_POLICY,
  EDIT_AUTOMATION_POLICY,
  CLICK_TURBO_LINK_FOR_DETAILS,
  EXECUTE_TURBO_ACTION
} from 'in-services/tracking/tracking';

export const associateActionsTracker = (e: Object) => track(REMEDIATION_ASSOCIATE_ACTION, e);
export const deleteActionAssociationTracker = (e: Object) => track(DELETE_ASSOCIATE_ACTION, e);
export const deleteActionAssociationAppAlertTracker = (e: Object) => track(DELETE_ASSOCIATE_ACTION_APP_ALERT, e);
export const runActionTracker = (e: Object) => track(REMEDIATION_RUN_ACTION, e);
export const createActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_CREATE, e);
export const editActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_EDIT, e);
export const deleteActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_DELETE, e);
export const actionHistoryTracker = () => track(AUTOMATION_ACTION_HISTORY_VIEW);
export const actionHistoryInstanceViewTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW, e);
export const actionHistoryInstanceFeedbackTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND, e);
export const createPolicyTracker = (e: Object) => track(CREATE_AUTOMATION_POLICY, e);
export const editPolicyTracker = (e: Object) => track(EDIT_AUTOMATION_POLICY, e);
export const clickTurboLinkForDetailsTracker = (e: Object) => track(CLICK_TURBO_LINK_FOR_DETAILS, e);
export const executeTurboActionTracker = (e: Object) => track(EXECUTE_TURBO_ACTION, e);
