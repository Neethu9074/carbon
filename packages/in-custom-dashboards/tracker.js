/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  CUSTOM_DASHBOARD_CREATE,
  CUSTOM_DASHBOARD_EDIT,
  CUSTOM_DASHBOARD_SHARE,
  CUSTOM_DASHBOARD_DELETE,
  CUSTOM_DASHBOARD_ADD_WIDGET_START,
  CUSTOM_DASHBOARD_ADD_WIDGET_FINISH,
  CUSTOM_DASHBOARD_EDIT_WIDGET_START,
  CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL,
  CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH,
  CUSTOM_DASHBOARD_VIEW_WIDGET
} from 'in-services/tracking/tracking';
import { emptyObject } from 'in-services/fixedObjects';
import widgets from 'in-custom-dashboards/widgets';

export const createDashboard = title => track(CUSTOM_DASHBOARD_CREATE, { title });
export const shareDashboard = title => track(CUSTOM_DASHBOARD_SHARE, { title });
export const editDashboard = title => track(CUSTOM_DASHBOARD_EDIT, { title });
export const deleteDashboard = title => track(CUSTOM_DASHBOARD_DELETE, { title });

export const startAddWidget = () => track(CUSTOM_DASHBOARD_ADD_WIDGET_START);
export const finishAddWidget = widget => track(CUSTOM_DASHBOARD_ADD_WIDGET_FINISH, getTrackingMeta(widget));

export const startEditWidget = widget => track(CUSTOM_DASHBOARD_EDIT_WIDGET_START, getTrackingMeta(widget));
export const cancelEditWidget = widget => track(CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL, getTrackingMeta(widget));
export const finishEditWidget = widget => track(CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH, getTrackingMeta(widget));

export const viewWidget = widget => track(CUSTOM_DASHBOARD_VIEW_WIDGET, getTrackingMeta(widget));

function getTrackingMeta(widget) {
  const widgetType = widget.type;
  const customMeta = widgets[widgetType]?.getTrackingMeta?.(widget.config) || emptyObject;
  return {
    ...customMeta,
    widgetType
  };
}
