/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, MapForm } from 'formalistic';

import { MetricSource } from '@instana/types/typeDefinitions';

//@ts-expect-error needs ts migration
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form.js';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';

interface FormState {
  compareToTimeShifted: undefined;
  label: string;
  source: MetricSource;
  timeShift: number;
}

export function createForm(form: MapForm<any>, savedState: FormState) {
  return addTagFilterExpressionField(form, savedState).put(
    'metric',
    createField({
      // Metric selection not necessary because there is only one metric.
      // Therefore hard coded
      value: 'logs_distribution',
      validator: composeAndShortCircuitOnError(
        notUndefinedValidator,
        stringValidator,
        notBlankValidator,
        buildEnumValidator(['logs_distribution'])
      )
    })
  );
}
