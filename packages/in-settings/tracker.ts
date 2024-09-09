/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  SETTINGS_USER_INVITE_SUBMIT,
  SETTINGS_ROLE_SUBMIT,
  SETTINGS_ROLE_OPEN_SUBMIT_FORM,
  SETTINGS_EVENT_VIEW,
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
  SHARE_AND_INVITE_INVITEE_JOINED,
  SHARE_AND_INVITE_ADD_USER,
  SHARE_AND_INVITE_NEW_GROUP,
  SHARE_AND_INVITE_COPY_LINK,
  UNIT_ONBOARDING_START_INTEGRATING_CLICK,
  UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK,
  UNIT_ONBOARDING_CONNECT_WITH_EXPERTS_CLICK,
  UNIT_ONBOARDING_BRING_IN_MORE_DATA_CLICK,
  UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK,
  UNIT_ONBOARDING_GET_ALERTED_CLICK,
  UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK,
  UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK
} from 'in-services/tracking/tracking';
// Import Segment tracker files
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { EventTrackerProps } from 'in-services/tracking/segment/types';
import { CTA_CLICKED } from 'in-services/util/constants';

export const submitInviteUserTracker = (e: Object) => track(SETTINGS_USER_INVITE_SUBMIT, e);
export const shareAndInviteSubmitTracker = (e: Object) => track(SHARE_AND_INVITE_SUBMIT, e);
export const closedInviteAndShareModal = () => track(SHARE_AND_INVITE_CLOSED);
export const inviteAndShareButtonClicked = (e: Object) => track(SHARE_AND_INVITE_TRIGGERED, e);
export const addUserInviteAndShareModal = () => track(SHARE_AND_INVITE_ADD_USER);
export const newGroupInviteAndShareModal = () => track(SHARE_AND_INVITE_NEW_GROUP);
export const copyLinkInviteAndShareModal = () => track(SHARE_AND_INVITE_COPY_LINK);
export const invitedUserJoined = (e: Object) => track(SHARE_AND_INVITE_INVITEE_JOINED, e);

export const unitOnboardingStartIntegratingClick = () => track(UNIT_ONBOARDING_START_INTEGRATING_CLICK);
export const unitOnboardingTraceInteractionsClick = () => track(UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK);
export const unitOnboardingConnectWithExpertClick = () => track(UNIT_ONBOARDING_CONNECT_WITH_EXPERTS_CLICK);
export const unitOnboardingBringInMoreDataClick = () => track(UNIT_ONBOARDING_BRING_IN_MORE_DATA_CLICK);
export const unitOnboardingTailorYourViewClick = () => track(UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK);
export const unitOnboardingGetAlertedClick = () => track(UNIT_ONBOARDING_GET_ALERTED_CLICK);
export const unitOnboardingMonitorEnvClick = () => track(UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK);
export const unitOnboardingBringYourTeamClick = () => track(UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK);

export const submitRoleTracker = (e: Object) => track(SETTINGS_ROLE_SUBMIT, e);
export const openRoleSubmitFormTracker = (e: Object) => track(SETTINGS_ROLE_OPEN_SUBMIT_FORM, e);

// Maintained by Team Alert Response
export const createAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_CREATE, e);
export const openAlertChannelSubmitFormTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM, e);
export const clickAddAlertChannelMenuTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK, e);
export const clickAddAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_ADD_CLICK, e);
export const clickTestAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_TEST_CLICK, e);
export const clickAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_CLICK, e);
export const deleteAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_DELETE, e);
export const editAlertChannelTracker = (e: Object) => track(SETTINGS_ALERT_CHANNEL_EDIT, e);

export const viewEventTracker = (e: Object) => track(SETTINGS_EVENT_VIEW, e);

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

// Segment trackers

interface AlertChannelCTATrackingType {
  EVENT_NAME: string;
  path?: string;
  channel?: string;
  additionalLabel?: string;
}

// Common function using CTA_CLICKED.
export const alertChannelCTATrackerSegment = ({
  EVENT_NAME,
  path,
  channel,
  additionalLabel
}: AlertChannelCTATrackingType) => {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  const data = {
    CTA: EVENT_NAME,
    channel: channel,
    parentPageName: pageRootName,
    parentPageCategory: productArea,
    path: path,
    label: additionalLabel
  } as EventTrackerProps['data'];
  eventTracker({ data, segmentEventName: CTA_CLICKED });
};
