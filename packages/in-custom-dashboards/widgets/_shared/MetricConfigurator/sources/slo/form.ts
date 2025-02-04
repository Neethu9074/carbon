/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm, createField } from 'formalistic';

import { SloEntityType, SloMetricType, Threshold } from '@instana/types';

// @ts-expect-error
import { createThresholdForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';

interface State {
  configId: string;
  entityType: SloEntityType;
  metric: SloMetricType;
  threshold: Threshold;
}

export type SloForm = MapForm<{
  configId: Field<string>;
  entityType: Field<SloEntityType>;
  metric: Field<string>;
  aggregation: Field<string>;
  threshold: MapForm<{
    thresholdEnabled: Field<boolean>;
    critical: Field<string>;
    warning: Field<string>;
    operator: Field<string>;
  }>;
}>;

export function createForm(form: MapForm<any>, savedState?: State) {
  return form
    .put(
      'configId',
      createField({
        value: savedState?.configId ?? '',
        validator: composeAndShortCircuitOnError(stringValidator, notBlankValidator)
      })
    )
    .put(
      'entityType',
      createField({
        value: savedState?.entityType ?? 'application',
        validator: notBlankValidator
      })
    )
    .put(
      'metric',
      createField({
        value: savedState?.metric || '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        // Aggregation selection not necessary because there is only one metric.
        // Therefore hard coded
        value: 'MEAN',
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(['MEAN'])
        )
      })
    )
    .put('threshold', createThresholdForm(savedState?.threshold));
}
