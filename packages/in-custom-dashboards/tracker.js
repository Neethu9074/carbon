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
  CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH
} from 'in-services/tracking/tracking';

export const createDashboard = title => track(CUSTOM_DASHBOARD_CREATE, { title });
export const shareDashboard = title => track(CUSTOM_DASHBOARD_SHARE, { title });
export const editDashboard = title => track(CUSTOM_DASHBOARD_EDIT, { title });
export const deleteDashboard = title => track(CUSTOM_DASHBOARD_DELETE, { title });

export const startAddWidget = () => track(CUSTOM_DASHBOARD_ADD_WIDGET_START);
export const finishAddWidget = widgetType => track(CUSTOM_DASHBOARD_ADD_WIDGET_FINISH, { widgetType });

export const startEditWidget = widgetType => track(CUSTOM_DASHBOARD_EDIT_WIDGET_START, { widgetType });
export const cancelEditWidget = widgetType => track(CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL, { widgetType });
export const finishEditWidget = widgetType => track(CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH, { widgetType });
