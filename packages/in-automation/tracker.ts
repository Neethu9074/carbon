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
  SETTINGS_AUTOMATION_ACTION_DELETE
} from 'in-services/tracking/tracking';

export const associateActionsTracker = (e: any) => track(REMEDIATION_ASSOCIATE_ACTION, e);
export const runActionTracker = (e: any) => track(REMEDIATION_RUN_ACTION, e);
export const createActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_CREATE, e);
export const editActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_EDIT, e);
export const deleteActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_DELETE, e);
