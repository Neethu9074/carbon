/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { track, ALERT_PREVIEW_MARKER_FETCH_RETRY } from 'in-services/tracking/tracking';

export const trackAlertPreviewMarkerFetchRetry = (count: number = 0) =>
  track(ALERT_PREVIEW_MARKER_FETCH_RETRY, { count });
