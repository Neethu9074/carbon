/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField } from 'formalistic';

import {
  bluePrintForCallsMetric,
  potentialProblemsCallsUnexpectedLowOrHighNumber
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/PotentialProblemsConfiguration/PotentialProblemsConfiguration';
import { migrate as migrateTagFilterArray } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { booleanValidator, stringValidator } from 'in-services/validators/jsonType';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';

export function createForm(form, savedState) {
  let updatedForm;

  updatedForm = addTagFilterExpressionField(form, savedState);
  updatedForm = addHiddenCalls(updatedForm, savedState);
  updatedForm = addPotentialProblems(updatedForm, savedState);

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

function addPotentialProblems(form, savedState) {
  return form
    .put(
      'potentialProblems',
      createField({
        value: savedState?.potentialProblems || false,
        validator: composeAndShortCircuitOnError(booleanValidator)
      })
    )
    .put(
      'bluePrintForCallsMetric',
      createField({
        value: savedState?.bluePrintForCallsMetric || potentialProblemsCallsUnexpectedLowOrHighNumber,
        validator: composeAndShortCircuitOnError(
          notUndefinedValidator,
          stringValidator,
          notBlankValidator,
          buildEnumValidator(Object.keys(bluePrintForCallsMetric))
        )
      })
    );
}
