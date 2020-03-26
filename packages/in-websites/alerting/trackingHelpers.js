import { debounce } from 'lodash';

import {
  websitesAlertingThresholdValueChanged,
  websitesAlertingThresholdDeviationFactorChanged
} from 'in-websites/alerting/tracker';

export function getBlueprintObject(form) {
  return { bluePrint: form.get('rule').get('alertType').value };
}

export const debouncedThresholdValueChangedTracker = debounce(websitesAlertingThresholdValueChanged, 300);
export const debouncedThresholdDeviationFactorChangedTracker = debounce(
  websitesAlertingThresholdDeviationFactorChanged,
  300
);
