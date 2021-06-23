/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  potentialProblemsCategory,
  potentialProblemsCallsUnexpectedHighNumber,
  bluePrintForCallsMetric,
  potentialProblemsCallsUnexpectedLowNumber,
  potentialProblemsCallsUnexpectedLowOrHighNumber
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import { source as applicationSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
import { isPotentialProblemsSupportedByMetric } from 'in-applications/analyze/metrics';

export function potentialProblemsOnDatasetValidator(datasetForm) {
  if (datasetForm?.source?.value === applicationSource) {
    const { metric, potentialProblems, grouping } = datasetForm;
    if (potentialProblems) {
      const errors = [];

      const hasGrouping = grouping?.get(0)?.toJS();
      if (hasGrouping) {
        errors.push({
          severity: 'error',
          message: 'Remove grouping to enable potential problems highlighting.',
          category: potentialProblemsCategory
        });
      }

      if (metric?.value) {
        if (!isPotentialProblemsSupportedByMetric(metric.value)) {
          errors.push({
            severity: 'error',
            message: 'Current metric is not supported.',
            category: potentialProblemsCategory
          });
        } else {
          // only add error when the metric is supported

          const bluePrintForCallsMetricField = potentialProblems?.get('bluePrintForCallsMetric');
          if (!isBluePrintForCallsSupportedByMetric(bluePrintForCallsMetricField, metric)) {
            errors.push({
              severity: 'error',
              message:
                'For this metric, only "' +
                bluePrintForCallsMetric[potentialProblemsCallsUnexpectedHighNumber] +
                '" is supported.',
              category: potentialProblemsCategory
            });
          }
        }
      }

      return errors;
    }
  }
  return null;
}

export function isBluePrintForCallsSupportedByMetric(bluePrintForCallsMetricField, metricField) {
  const bluePrintForMetric = bluePrintForCallsMetricField?.value;
  const metric = metricField?.value;

  if (bluePrintForMetric && metric) {
    if (metric === 'latency' || metric === 'errors') {
      return bluePrintForMetric === potentialProblemsCallsUnexpectedHighNumber;
    }
    if (metric === 'calls') {
      return (
        bluePrintForMetric === potentialProblemsCallsUnexpectedLowNumber ||
        bluePrintForMetric === potentialProblemsCallsUnexpectedHighNumber ||
        bluePrintForMetric === potentialProblemsCallsUnexpectedLowOrHighNumber
      );
    }
  }
  return false;
}
