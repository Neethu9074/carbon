/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, notBlankValidator } from 'formalistic';

import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';

export function createForm(form, savedState) {
  return addTagFilterExpressionField(form, savedState).put(
    'type',
    createField({
      value: savedState?.type || '',
      validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
    })
  );
}
