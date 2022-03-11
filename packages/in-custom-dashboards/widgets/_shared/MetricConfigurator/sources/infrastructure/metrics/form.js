/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { arrayValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { aggregationLabels } from 'in-stores/metric/metric';

export function createForm(form, savedState) {
  return addTagFilterExpressionField(form, savedState)
    .put(
      'type',
      createField({
        value: savedState?.type || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        value:
          savedState?.aggregation === 'SUM' && !savedState.crossSeriesAggregation
            ? 'MEAN' // migrate to new cross-series aggregation sum
            : savedState?.aggregation || '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(aggregationLabels))
        )
      })
    )
    .put(
      'crossSeriesAggregation',
      createField({
        value:
          savedState?.aggregation === 'SUM' && !savedState.crossSeriesAggregation
            ? 'SUM' // migrate to new cross-series aggregation sum
            : savedState?.crossSeriesAggregation || savedState?.aggregation || '',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(aggregationLabels))
        )
      })
    )
    .put(
      'allowedCrossSeriesAggregations',
      createField({
        value: savedState?.allowedCrossSeriesAggregations || [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'metricPath',
      createField({
        value: savedState?.metricPath || [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    );
}
