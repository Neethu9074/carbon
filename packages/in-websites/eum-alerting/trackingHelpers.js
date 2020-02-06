import { debounce } from 'lodash';

import {
  websitesAlertingThresholdValueChanged,
  websitesAlertingThresholdDeviationFactorChanged
} from 'in-websites/eum-alerting/tracker';
import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export function getBlueprintObject(form) {
  return { bluePrint: form.get(fieldNames.ruleAlertType).value };
}

export const debouncedThresholdValueChangedTracker = debounce(websitesAlertingThresholdValueChanged, 300);
export const debouncedThresholdDeviationFactorChangedTracker = debounce(
  websitesAlertingThresholdDeviationFactorChanged,
  300
);
