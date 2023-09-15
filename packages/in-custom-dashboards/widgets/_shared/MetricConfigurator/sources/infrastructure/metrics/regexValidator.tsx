/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

// @ts-expect-error needs to be converted to typescript
import { source as metricsSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/metrics';

export const regexValidationError = 'RegexValidationError';

export default function regexValidator(datasetForm: any) {
  const { source, regex, metric } = datasetForm;
  if (source?.value === metricsSource) {
    if (regex?.value) {
      try {
        new RegExp(metric?.value);
      } catch (e: any) {
        return [
          {
            severity: 'error',
            message: 'Regex is not valid',
            category: regexValidationError
          }
        ];
      }
    }
  }
  return null;
}
