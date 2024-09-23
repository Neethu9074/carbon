/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  POTENTIAL_PROBLEMS_MARKER_HOVERED,
  POTENTIAL_PROBLEMS_MARKER_CLICKED,
  POTENTIAL_PROBLEMS_SELECTED,
  POTENTIAL_PROBLEMS_DIALOG_CLOSED
} from 'in-services/tracking/tracking';

export const trackMarkerHovered = e => track(POTENTIAL_PROBLEMS_MARKER_HOVERED, e);
export const trackMarkerClicked = e => track(POTENTIAL_PROBLEMS_MARKER_CLICKED, e);
export const trackCurrentlySelected = e => track(POTENTIAL_PROBLEMS_SELECTED, e);
export const trackDialogClosed = e => track(POTENTIAL_PROBLEMS_DIALOG_CLOSED, e);
