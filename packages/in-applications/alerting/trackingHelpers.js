import { debounce } from 'lodash';

import {
  applicationsAlertingThresholdValueChanged,
  applicationsAlertingThresholdDeviationFactorChanged
} from 'in-applications/alerting/tracker';

export const debouncedThresholdValueChangedTracker = debounce(applicationsAlertingThresholdValueChanged, 300);
export const debouncedThresholdDeviationFactorChangedTracker = debounce(
  applicationsAlertingThresholdDeviationFactorChanged,
  300
);
