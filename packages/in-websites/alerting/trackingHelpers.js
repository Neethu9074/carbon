import { debounce } from 'lodash';

import {
  websitesAlertingThresholdValueChanged,
  websitesAlertingThresholdDeviationFactorChanged
} from 'in-websites/alerting/tracker';

export const debouncedThresholdValueChangedTracker = debounce(websitesAlertingThresholdValueChanged, 300);
export const debouncedThresholdDeviationFactorChangedTracker = debounce(
  websitesAlertingThresholdDeviationFactorChanged,
  300
);
