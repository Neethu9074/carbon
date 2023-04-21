/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  SETTINGS_USER_INVITE_SUBMIT,
  SETTINGS_ROLE_SUBMIT,
  SETTINGS_ROLE_OPEN_SUBMIT_FORM,
  SETTINGS_ALERT_CHANNEL_SUBMIT,
  SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM,
  SETTINGS_ALERT_SUBMIT,
  SETTINGS_ALERT_TOGGLE,
  SETTINGS_ALERT_HUB_WEBSITES_CLICK,
  SETTINGS_ALERT_HUB_SMART_ALERTS_CLICK,
  SETTINGS_ALERT_HUB_ALERTS_CLICK,
  SETTINGS_ALERT_HUB_EVENTS_CLICK,
  SETTINGS_ALERT_OPEN_SUBMIT_FORM,
  SETTINGS_EVENT_VIEW,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_EDIT_ITEM,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM,
  SETTINGS_EVENT_SUBMIT,
  SETTINGS_EVENT_OPEN_SUBMIT_FORM,
  SETTINGS_MAINTENANCE_WINDOW_NEW,
  SETTINGS_MAINTENANCE_WINDOW_REMOVE,
  SETTINGS_MAINTENANCE_WINDOW_EDIT,
  SETTINGS_MAINTENANCE_WINDOW_SUBMIT,
  SETTINGS_MAINTENANCE_WINDOW_CANCEL,
  SETTINGS_MAINTENANCE_WINDOW_RESUME,
  SETTINGS_MAINTENANCE_WINDOW_PAUSE,
  SETTINGS_AUTOMATION_ACTION_CREATE,
  SETTINGS_AUTOMATION_ACTION_EDIT,
  SETTINGS_AUTOMATION_ACTION_DELETE,
  SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE,
  SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO,
  SETTINGS_MAINTENANCE_WINDOW_ADANCED,
  SETTINGS_MAINTENANCE_WINDOW_SIMPLE,
  SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB,
  SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB,
  SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB
} from 'in-services/tracking/tracking';

export const submitInviteUserTracker = (e: Object) => track(SETTINGS_USER_INVITE_SUBMIT, e);

export const submitRoleTracker = (e: Object) => track(SETTINGS_ROLE_SUBMIT, e);
export const openRoleSubmitFormTracker = (e: Object) => track(SETTINGS_ROLE_OPEN_SUBMIT_FORM, e);

export const submitAlertTracker = (e: Object) => track(SETTINGS_ALERT_SUBMIT, e);
export const openAlertSubmitFormTracker = (e: Object) => track(SETTINGS_ALERT_OPEN_SUBMIT_FORM, e);
export const toggleAlertTracker = (e: Object) => track(SETTINGS_ALERT_TOGGLE, e);

export const submitAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_SUBMIT, e);
export const openAlertChannelSubmitFormTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM, e);

export const submitAlertCustomPayloadTracker = (e: Object) => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT, e);
export const addItemAlertCustomPayloadTracker = (e: Object) => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM, e);
export const editAlertCustomPayloadTracker = (e: Object) => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_EDIT_ITEM, e);
export const removeItemAlertCustomPayloadTracker = (e: Object) => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM, e);

export const alertHubWebsiteClickTracker = (e: Object) => track(SETTINGS_ALERT_HUB_WEBSITES_CLICK, e);
export const alertHubSmartAlertsClickTracker = (e: Object) => track(SETTINGS_ALERT_HUB_SMART_ALERTS_CLICK, e);
export const alertHubAlertsClickTracker = (e: Object) => track(SETTINGS_ALERT_HUB_ALERTS_CLICK, e);
export const alertsHubEventsClickTracker = (e: Object) => track(SETTINGS_ALERT_HUB_EVENTS_CLICK, e);

export const submitEventTracker = (e: Object) => track(SETTINGS_EVENT_SUBMIT, e);
export const openEventSubmitFormTracker = (e: Object) => track(SETTINGS_EVENT_OPEN_SUBMIT_FORM, e);
export const viewEventTracker = (e: Object) => track(SETTINGS_EVENT_VIEW, e);

export const newMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_NEW, e);
export const removeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_REMOVE, e);
export const editMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_EDIT, e);
export const submitMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_SUBMIT, e);
export const cancelMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_CANCEL, e);
export const resumeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_RESUME, e);
export const pauseMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_PAUSE, e);
export const simpleModeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_SIMPLE, e);
export const advancedModeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_ADANCED, e);
export const nextStepOneMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE, e);
export const nextStepTwoMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO, e);
export const switchToActiveMaintenanceWindowsTabTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB, e);
export const switchToScheduledMaintenanceWindowsTabTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB, e);
export const switchToExpiredMaintenanceWindowsTabTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB, e);

export const createActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_CREATE, e);
export const editActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_EDIT, e);
export const deleteActionTracker = (e: Object) => track(SETTINGS_AUTOMATION_ACTION_DELETE, e);
