/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { debounce } from 'lodash';

import {
  track,
  SLI_WIDGET_JUMP_TO_UNBOUNDED_ANALYTICS,
  SLI_WIDGET_START_EDITING,
  SLI_WIDGET_AP_CHANGED,
  SLI_WIDGET_SLI_CHANGED,
  SLI_WIDGET_SLO_CHANGED,
  SLI_WIDGET_OPEN_SLI_MANAGEMENT,
  SLI_WIDGET_TIME_WINDOW_TYPE_CHANGED,
  SLI_MANAGEMENT_CREATE,
  SLI_MANAGEMENT_VIEW,
  SLI_MANAGEMENT_DELETED,
  SLI_MANAGEMENT_NEW_CREATED,
  SLI_MANAGEMENT_CLONED,
  SLI_MANAGEMENT_EDIT_ABORT
} from 'in-services/tracking/tracking';

export const trackJumpToUnboundedAnalyticsFromSloWidget = e => track(SLI_WIDGET_JUMP_TO_UNBOUNDED_ANALYTICS, e);

export const trackStartEditingSloWidgetConfig = e => track(SLI_WIDGET_START_EDITING, e);
export const trackAPSelected = e => track(SLI_WIDGET_AP_CHANGED, e);
export const trackSliChanged = e => track(SLI_WIDGET_SLI_CHANGED, e);
export const trackSloChanged = e => track(SLI_WIDGET_SLO_CHANGED, e);
export const debouncedTrackSloChanged = debounce(trackSloChanged, 3000);
export const trackTimeWindowTypeChanged = e => track(SLI_WIDGET_TIME_WINDOW_TYPE_CHANGED, e);

export const trackOpenSLIManagement = e => track(SLI_WIDGET_OPEN_SLI_MANAGEMENT, e);
export const trackSliCreate = e => track(SLI_MANAGEMENT_CREATE, e);
export const trackSliViewSLI = e => track(SLI_MANAGEMENT_VIEW, e);
export const trackSliDeleted = e => track(SLI_MANAGEMENT_DELETED, e);
export const trackSliNewCreated = e => track(SLI_MANAGEMENT_NEW_CREATED, e);
export const trackSLICloned = e => track(SLI_MANAGEMENT_CLONED, e);
export const trackSLIEditAbort = e => track(SLI_MANAGEMENT_EDIT_ABORT, e);
