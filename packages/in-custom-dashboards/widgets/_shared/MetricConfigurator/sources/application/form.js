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
  const newForm = addTagFilterExpressionField(form, savedState);
  return addHiddenCalls(newForm, savedState);
}

export function migrate(savedState) {
  return migrateTagFilterArray({
    savedState,
    getTagCatalog
  });
}

function addHiddenCalls(form, savedState) {
  let includeInternal = savedState?.includeInternal || false;
  let includeSynthetic = savedState?.includeSynthetic || false;

  return form
    .put(
      'includeInternal',
      createField({
        value: includeInternal,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'includeSynthetic',
      createField({
        value: includeSynthetic,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    );
}
