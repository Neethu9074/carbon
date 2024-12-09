/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { isEmpty } from 'lodash';

import { MAX_LABEL_LENGTH } from 'in-alerting/formFieldLengths';
import { emptyObject } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function getMetricPathAndLabel(options, metricName, entityType) {
  for (let i = 0; i < options?.length; i++) {
    const option = options[i];
    if (option.levelType === entityType && option.metric === metricName) {
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

export function titleValidator() {
  return value => {
    if (typeof value === 'string' && value.length > MAX_LABEL_LENGTH) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeShorterThanMaxLengthCharacters', {
            maxLength: MAX_LABEL_LENGTH
          })
        }
      ];
    } else if (value == null || (typeof value === 'string' && isBlank(value))) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.theValueMustNotBeBlank')
        }
      ];
    }
    return null;
  };
}
