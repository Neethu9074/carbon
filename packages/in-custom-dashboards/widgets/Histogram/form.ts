/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';

// @ts-expect-error
import { createForm as createMetricConfigurationForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { metricConfigurationPath, formatterPath, formatterSelectedPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { defaultFormatter, allFormatterIds } from 'in-stores/metric/formatters';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { UnifiedMetricConfigurationUnion } from 'in-types';

export interface HistogramConfig {
  [formatterPath]: string;
  [formatterSelectedPath]?: boolean;
  [metricConfigurationPath]?: UnifiedMetricConfigurationUnion;
}

export function createForm(savedState: Partial<HistogramConfig>) {
  return createMapForm()
    .put(
      formatterPath,
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
    .put(metricConfigurationPath, createMetricConfigurationForm(savedState && savedState.metricConfiguration));
}
