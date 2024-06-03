/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  SETTINGS_USER_INVITE_SUBMIT,
  SETTINGS_ROLE_SUBMIT,
  SETTINGS_ROLE_OPEN_SUBMIT_FORM,
  SETTINGS_ALERT_SUBMIT,
  SETTINGS_ALERT_TOGGLE,
  SETTINGS_ALERT_DELETE,
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
  SETTINGS_EVENT_ENABLE,
  SETTINGS_EVENT_DISABLE,
  SETTINGS_EVENT_DELETED,
  SETTINGS_EVENT_DELETE_TRIGGER,
  SETTINGS_MAINTENANCE_WINDOW_NEW,
  SETTINGS_MAINTENANCE_WINDOW_REMOVE,
  SETTINGS_MAINTENANCE_WINDOW_EDIT,
  SETTINGS_MAINTENANCE_WINDOW_SUBMIT,
  SETTINGS_MAINTENANCE_WINDOW_CANCEL,
  SETTINGS_MAINTENANCE_WINDOW_RESUME,
  SETTINGS_MAINTENANCE_WINDOW_PAUSE,
  SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE,
  SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO,
  SETTINGS_MAINTENANCE_WINDOW_ADVANCED,
  SETTINGS_MAINTENANCE_WINDOW_SIMPLE,
  SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB,
  SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB,
  SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB,
  SETTINGS_ALERT_CHANNEL_CREATE,
  SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM,
  SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK,
  SETTINGS_ALERT_CHANNEL_ADD_CLICK,
  SETTINGS_ALERT_CHANNEL_TEST_CLICK,
  SETTINGS_ALERT_CHANNEL_CLICK,
  SETTINGS_ALERT_CHANNEL_DELETE,
  SETTINGS_ALERT_CHANNEL_EDIT,
  SETTINGS_MAINTENANCE_WINDOW_FEEDBACK_SUBMIT,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR,
  SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED,
  SHARE_AND_INVITE_SUBMIT,
  SHARE_AND_INVITE_CLOSED,
  SHARE_AND_INVITE_TRIGGERED,
  SHARE_AND_INVITE_INVITEE_JOINED
} from 'in-services/tracking/tracking';

export const submitInviteUserTracker = (e: Object) => track(SETTINGS_USER_INVITE_SUBMIT, e);
export const shareAndInviteSubmitTracker = (e: Object) => track(SHARE_AND_INVITE_SUBMIT, e);
export const closedInviteAndShareModal = () => track(SHARE_AND_INVITE_CLOSED);
export const inviteAndShareButtonClicked = (e: Object) => track(SHARE_AND_INVITE_TRIGGERED, e);
export const invitedUserJoined = (e: Object) => track(SHARE_AND_INVITE_INVITEE_JOINED, e);

export const submitRoleTracker = (e: Object) => track(SETTINGS_ROLE_SUBMIT, e);
export const openRoleSubmitFormTracker = (e: Object) => track(SETTINGS_ROLE_OPEN_SUBMIT_FORM, e);

export const submitAlertTracker = (e: Object) => track(SETTINGS_ALERT_SUBMIT, e);
export const openAlertSubmitFormTracker = (e: Object) => track(SETTINGS_ALERT_OPEN_SUBMIT_FORM, e);
export const toggleAlertTracker = (e: Object) => track(SETTINGS_ALERT_TOGGLE, e);
export const deleteAlertTracker = (e: Object) => track(SETTINGS_ALERT_DELETE, e);

// Maintained by Team Alert Response
export const createAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_CREATE, e);
export const openAlertChannelSubmitFormTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM, e);
export const clickAddAlertChannelMenuTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK, e);
export const clickAddAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_ADD_CLICK, e);
export const clickTestAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_TEST_CLICK, e);
export const clickAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_CLICK, e);
export const deleteAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_DELETE, e);
export const editAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_EDIT, e);

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
export const trackerEventEnabled = (e: Object) => track(SETTINGS_EVENT_ENABLE, e);
export const trackerEventDisabled = (e: Object) => track(SETTINGS_EVENT_DISABLE, e);
export const trackerEventDeleted = (e: Object) => track(SETTINGS_EVENT_DELETED, e);
export const trackerEventDeleteTrigger = (e: Object) => track(SETTINGS_EVENT_DELETE_TRIGGER, e);

export const logManagementDeleteLogsClickedTracker = (e: Object) =>
  track(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED, e);
export const logManagementDeleteLogsSubmittedTracker = (e: Object) =>
  track(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED, e);
export const logManagementDeleteLogsSuccessTracker = (e: Object) =>
  track(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS, e);
export const logManagementDeleteLogsErrorTracker = (e: Object) => track(SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR, e);

export const newMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_NEW, e);
export const removeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_REMOVE, e);
export const editMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_EDIT, e);
export const submitMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_SUBMIT, e);
export const cancelMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_CANCEL, e);
export const resumeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_RESUME, e);
export const pauseMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_PAUSE, e);
export const simpleModeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_SIMPLE, e);
export const advancedModeMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_ADVANCED, e);
export const nextStepOneMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE, e);
export const nextStepTwoMaintenanceWindowTracker = (e: Object) => track(SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO, e);
export const switchToActiveMaintenanceWindowsTabTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB, e);
export const switchToScheduledMaintenanceWindowsTabTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB, e);
export const switchToExpiredMaintenanceWindowsTabTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB, e);
export const maintenanceWindowFeedbackSubmitTracker = (e: Object) =>
  track(SETTINGS_MAINTENANCE_WINDOW_FEEDBACK_SUBMIT, e);
