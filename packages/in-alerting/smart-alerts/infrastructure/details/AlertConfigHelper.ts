/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { number, NumberFormatter } from 'in-services/formatters/number';
import { deepFreeze } from 'in-services/util/object';
import { Option } from 'in-components/ComboBox';

type ThresholdTypeOptions = readonly Option[];

const infraThresholdTypeOptions: ThresholdTypeOptions = deepFreeze([...thresholdTypeOptions]);

export function getMetricFormat(): NumberFormatter {
  return number.forcedCompact;
}

export function getThresholdTypeOptions(): ThresholdTypeOptions {
  return infraThresholdTypeOptions;
}
