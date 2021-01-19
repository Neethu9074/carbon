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
  SETTINGS_ALERT_OPEN_SUBMIT_FORM,
  SETTINGS_EVENT_VIEW,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_EDIT_ITEM,
  SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM,
  SETTINGS_EVENT_SUBMIT,
  SETTINGS_EVENT_OPEN_SUBMIT_FORM
} from 'in-services/tracking/tracking';

export const submitInviteUserTracker = e => track(SETTINGS_USER_INVITE_SUBMIT, e);

export const submitRoleTracker = e => track(SETTINGS_ROLE_SUBMIT, e);
export const openRoleSubmitFormTracker = e => track(SETTINGS_ROLE_OPEN_SUBMIT_FORM, e);

export const submitAlertTracker = e => track(SETTINGS_ALERT_SUBMIT, e);
export const openAlertSubmitFormTracker = e => track(SETTINGS_ALERT_OPEN_SUBMIT_FORM, e);
export const toggleAlertTracker = e => track(SETTINGS_ALERT_TOGGLE, e);

export const submitAlertChannelTracker = e => track(SETTINGS_ALERT_CHANNEL_SUBMIT, e);
export const openAlertChannelSubmitFormTracker = e => track(SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM, e);

export const submitAlertCustomPayloadTracker = e => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT, e);
export const addItemAlertCustomPayloadTracker = e => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM, e);
export const editAlertCustomPayloadTracker = e => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_EDIT_ITEM, e);
export const removeItemAlertCustomPayloadTracker = e => track(SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM, e);

export const submitEventTracker = e => track(SETTINGS_EVENT_SUBMIT, e);
export const openEventSubmitFormTracker = e => track(SETTINGS_EVENT_OPEN_SUBMIT_FORM, e);
export const viewEventTracker = e => track(SETTINGS_EVENT_VIEW, e);
