/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';

import { emptyObject } from 'in-services/fixedObjects';

export function getMetricPathAndLabel(options, metricName, entityType) {
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.parentType === entityType && option.metric === metricName) {
      return {
        path: option.parentLabels,
        label: option.label
      };
    } else {
      const metricPathAndLabelForChild = getMetricPathAndLabel(option.children, metricName, entityType);

      if (!isEmpty(metricPathAndLabelForChild)) {
        return metricPathAndLabelForChild;
      }
    }
  }
  return emptyObject;
}

export function setDefaultMetrics(items, setSelectedMetricGroup, selectedMetricGroup) {
  if (items?.length === 0) {
    return;
  }

  if (selectedMetricGroup) {
    const metricExistsInItems = items.find(item => item.tags === selectedMetricGroup);
    if (metricExistsInItems) {
      return;
    }
  }

  setSelectedMetricGroup(items[0].tags);
}
