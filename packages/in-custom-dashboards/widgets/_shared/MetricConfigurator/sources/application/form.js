/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import { migrate as migrateTagFilterArray } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { booleanValidator } from 'in-services/validators/jsonType';

export function createForm(form, savedState) {
  let updatedForm;

  updatedForm = addTagFilterExpressionField(form, savedState);
  updatedForm = addHiddenCalls(updatedForm, savedState);

  return updatedForm;
}

export function migrate(savedState) {
  return migrateTagFilterArray({
    savedState,
    getTagCatalog
  });
}

function addHiddenCalls(form, savedState) {
  return form
    .put(
      'includeInternal',
      createField({
        value: savedState?.includeInternal || false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'includeSynthetic',
      createField({
        value: savedState?.includeSynthetic || false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    );
}
