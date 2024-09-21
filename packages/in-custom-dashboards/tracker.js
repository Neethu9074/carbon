/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { emptyObject } from 'in-services/fixedObjects';
import widgets from 'in-custom-dashboards/widgets';

export function getTrackingMeta(widget) {
  const widgetType = widget?.type;
  const customMeta = widgets[widgetType]?.getTrackingMeta?.(widget?.config) || emptyObject;
  return {
    ...customMeta,
    widgetType
  };
}
