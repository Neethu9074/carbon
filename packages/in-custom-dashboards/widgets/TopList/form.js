/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';

import {
  createForm as createMetricConfigurationForm,
  migrate as migrateMetricConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { defaultFormatter, allFormatterIds } from 'in-stores/metric/formatters';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createForm(savedState) {
  return createMapForm()
    .put(
      'formatter',
      createField({
        value: savedState?.formatter ?? defaultFormatter.id,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(allFormatterIds)
        )
      })
    )
    .put(
      'metricConfiguration',
      createMetricConfigurationForm(savedState && savedState.metricConfiguration, { withMandatoryGrouping: true })
    );
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
