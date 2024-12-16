/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { arrayValidator, booleanValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { aggregationLabels } from 'in-stores/metric/metric';
import { allUnits, number } from 'in-stores/metric/units';

const DEFAULT_AGGREGATION = 'MEAN';

export function createForm(form, savedState) {
  return addTagFilterExpressionField(form, savedState)
    .put(
      'type',
      createField({
        value: savedState?.type,
        validator: composeAndShortCircuitOnError(stringValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        value:
          savedState?.aggregation === 'SUM' && !savedState.crossSeriesAggregation
            ? 'MEAN' // migrate to new cross-series aggregation sum
            : savedState?.aggregation || DEFAULT_AGGREGATION,
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
            : savedState?.crossSeriesAggregation || savedState?.aggregation || DEFAULT_AGGREGATION,
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
      'lastValue',
      createField({
        value: savedState?.lastValue || false,
        validator: composeAndShortCircuitOnError(notUndefinedValidator)
      })
    )
    .put(
      'metricPath',
      createField({
        value: savedState?.metricPath || [],
        validator: composeAndShortCircuitOnError(notUndefinedValidator, arrayValidator)
      })
    )
    .put(
      'formatter',
      createField({
        value: savedState?.formatter || undefined,
        validator: composeAndShortCircuitOnError(stringValidator)
      })
    )
    .put(
      'regex',
      createField({
        value: savedState?.regex || undefined,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'unit',
      createField({
        value: savedState?.unit || number?.id,
        validator: composeAndShortCircuitOnError(
          buildEnumValidator(Object.values(allUnits).map(({ id: value }) => value))
        )
      })
    );
}
