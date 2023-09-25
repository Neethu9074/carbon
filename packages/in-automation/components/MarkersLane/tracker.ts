/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  ACTION_LANES_MARKER_HOVERED,
  ACTION_LANES_MARKER_CLICKED,
  ACTION_LANES_INVESTIGATE_FILTER,
  ACTION_LANES_VIEW_ENTITY,
  ACTION_LANES_SELECTED,
  ACTION_LANES_DIALOG_CLOSED
} from 'in-services/tracking/tracking';

export const trackMarkerHovered = (e: Object) => track(ACTION_LANES_MARKER_HOVERED, e);
export const trackMarkerClicked = (e: Object) => track(ACTION_LANES_MARKER_CLICKED, e);
export const trackGoToInvestigate = (e: Object) => track(ACTION_LANES_INVESTIGATE_FILTER, e);
export const trackViewEntity = (e: Object) => track(ACTION_LANES_VIEW_ENTITY, e);
export const trackCurrentlySelected = (e: Object) => track(ACTION_LANES_SELECTED, e);
export const trackDialogClosed = (e: Object) => track(ACTION_LANES_DIALOG_CLOSED, e);
