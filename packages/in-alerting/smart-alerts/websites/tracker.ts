/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE,
  WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG
} from 'in-services/tracking/tracking';

export const websitesAlertingEventDetailsGoToAnalyze = (e: any) =>
  track(WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE, e);
export const websitesAlertingEventDetailsViewEditConfig = (e: any) =>
  track(WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, e);
