/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';

import {
  createForm as createMetricConfigurationForm,
  migrate as migrateMetricConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import * as allComparisonColors from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { green, red } from 'in-custom-dashboards/widgets/BigNumber/comparisonColors';
import { stringValidator, booleanValidator } from 'in-services/validators/jsonType';
import { allFormatterIds, defaultFormatter } from 'in-stores/metric/formatters';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';

const validComparisonColors = Object.values(allComparisonColors).map(c => c.id);

export function createForm(savedState) {
  return createMapForm()
    .put(
      'formatter',
      createField({
        value: savedState?.formatter ?? defaultFormatter.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          // Not blank validator is in here for a better UX when using
          // the visual dialog. The enum validator exists when editing
          // as JSON.
          notBlankValidator,
          buildEnumValidator(allFormatterIds)
        )
      })
    )
    .put(
      'formatterSelected',
      createField({
        value: savedState?.formatterSelected ?? undefined,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'comparisonDecreaseColor',
      createField({
        value: savedState?.comparisonDecreaseColor ?? green.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          // Not blank validator is in here for a better UX when using
          // the visual dialog. The enum validator exists when editing
          // as JSON.
          notBlankValidator,
          buildEnumValidator(validComparisonColors)
        )
      })
    )
    .put(
      'comparisonIncreaseColor',
      createField({
        value: savedState?.comparisonIncreaseColor ?? red.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          // Not blank validator is in here for a better UX when using
          // the visual dialog. The enum validator exists when editing
          // as JSON.
          notBlankValidator,
          buildEnumValidator(validComparisonColors)
        )
      })
    )
    .put('metricConfiguration', createMetricConfigurationForm(savedState && savedState.metricConfiguration))
    .put('threshold', createBaseThresholdForm(savedState));
}

export function migrate(savedState) {
  return migrateMetricConfiguration(savedState.metricConfiguration).map(result => {
    if (!result.data) {
      return result;
    }

    return {
      ...result,
      data: {
        ...savedState,
        metricConfiguration: result.data
      }
    };
  });
}

function createBaseThresholdForm(savedState) {
  return createMapForm()
    .put(
      'thresholdEnabled',
      createField({
        value: Boolean(savedState && savedState.thresholdEnabled),
        validator: composeAndShortCircuitOnError(notUndefinedValidator, booleanValidator)
      })
    )
    .put(
      'critical',
      createField({
        value: (savedState && savedState.critical) || undefined
      })
    )
    .put(
      'warning',
      createField({
        value: (savedState && savedState.warning) || undefined
      })
    )
    .put(
      'operator',
      createField({
        value: (savedState && savedState.operator) || '>='
      })
    );
}
