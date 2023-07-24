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
  ACTION_SMART_ALERT_ASSOCIATED,
  AUTOMATION_ACTION_HISTORY_VIEW,
  AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW,
  AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND,
  DELETE_ASSOCIATE_ACTION,
  DELETE_ASSOCIATE_ACTION_APP_ALERT
} from 'in-services/tracking/tracking';

export const associateActionsTracker = (e: any) => track(REMEDIATION_ASSOCIATE_ACTION, e);
export const deleteActionAssociationTracker = (e: Object) => track(DELETE_ASSOCIATE_ACTION, e);
export const deleteActionAssociationAppAlertTracker = (e: Object) => track(DELETE_ASSOCIATE_ACTION_APP_ALERT, e);
export const runActionTracker = (e: any) => track(REMEDIATION_RUN_ACTION, e);
export const createActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_CREATE, e);
export const editActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_EDIT, e);
export const deleteActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_DELETE, e);
export const trackAlertActionAssociated = (actions: string[], id: string) =>
  track(ACTION_SMART_ALERT_ASSOCIATED, { actions, id });
export const actionHistoryTracker = () => track(AUTOMATION_ACTION_HISTORY_VIEW);
export const actionHistoryInstanceViewTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW, e);
export const actionHistoryInstanceFeedbackTracker = (e: Object) => track(AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND, e);
