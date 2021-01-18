import {
  track,
  SLI_WIDGET_START_EDITING,
  SLI_WIDGET_AP_CHANGED,
  SLI_WIDGET_SLI_CHANGED,
  SLI_WIDGET_OPEN_SLI_MANAGEMENT,
  SLI_MANAGEMENT_CREATE,
  SLI_MANAGEMENT_VIEW,
  SLI_MANAGEMENT_DELETED,
  SLI_MANAGEMENT_NEW_CREATED,
  SLI_MANAGEMENT_CLONED,
  SLI_MANAGEMENT_EDIT_ABORT
} from 'in-services/tracking/tracking';

export const trackStartEditingForm = e => track(SLI_WIDGET_START_EDITING, e);
export const trackAPSelected = e => track(SLI_WIDGET_AP_CHANGED, e);
export const trackSliChanged = e => track(SLI_WIDGET_SLI_CHANGED, e);

export const trackOpenSLIManagement = e => track(SLI_WIDGET_OPEN_SLI_MANAGEMENT, e);
export const trackSliCreate = e => track(SLI_MANAGEMENT_CREATE, e);
export const trackSliViewSLI = e => track(SLI_MANAGEMENT_VIEW, e);
export const trackSliDeleted = e => track(SLI_MANAGEMENT_DELETED, e);
export const trackSliNewCreated = e => track(SLI_MANAGEMENT_NEW_CREATED, e);
export const trackSLICloned = e => track(SLI_MANAGEMENT_CLONED, e);
export const trackSLIEditAbort = e => track(SLI_MANAGEMENT_EDIT_ABORT, e);
