/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  POTENTIAL_PROBLEMS_MARKER_HOVERED,
  POTENTIAL_PROBLEMS_MARKER_CLICKED,
  POTENTIAL_PROBLEMS_SMART_ALERT_CREATE,
  POTENTIAL_PROBLEMS_GO_TO_ANALYZE,
  POTENTIAL_PROBLEMS_REQUEST_LOADING_TIME,
  POTENTIAL_PROBLEMS_SELECTED,
  POTENTIAL_PROBLEMS_DIALOG_CLOSED
} from 'in-services/tracking/tracking';

export const trackMarkerHovered = e => track(POTENTIAL_PROBLEMS_MARKER_HOVERED, e);
export const trackMarkerClicked = e => track(POTENTIAL_PROBLEMS_MARKER_CLICKED, e);
export const trackCreateSmartAlert = e => track(POTENTIAL_PROBLEMS_SMART_ALERT_CREATE, e);
export const trackGotoAnalyze = e => track(POTENTIAL_PROBLEMS_GO_TO_ANALYZE, e);
export const trackRequestLoadingTime = e => track(POTENTIAL_PROBLEMS_REQUEST_LOADING_TIME, e);
export const trackCurrentlySelected = e => track(POTENTIAL_PROBLEMS_SELECTED, e);
export const trackDialogClosed = e => track(POTENTIAL_PROBLEMS_DIALOG_CLOSED, e);
