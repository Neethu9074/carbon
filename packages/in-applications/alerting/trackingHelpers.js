import { debounce } from 'lodash';

import {
  applicationsAlertingThresholdValueChanged,
  applicationsAlertingThresholdDeviationFactorChanged
} from 'in-applications/alerting/tracker';

export function getBlueprintObject(form) {
  return { bluePrint: form.get('rule').get('alertType').value };
}

export const debouncedThresholdValueChangedTracker = debounce(applicationsAlertingThresholdValueChanged, 300);
export const debouncedThresholdDeviationFactorChangedTracker = debounce(
  applicationsAlertingThresholdDeviationFactorChanged,
  300
);
