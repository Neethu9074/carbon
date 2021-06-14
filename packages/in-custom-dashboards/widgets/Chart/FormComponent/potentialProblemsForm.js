/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const potentialProblemsCallsUnexpectedLowNumber = 'unexpectedLowNumberOfCalls';
export const potentialProblemsCallsUnexpectedHighNumber = 'unexpectedHighNumberOfCalls';
export const potentialProblemsCallsUnexpectedLowOrHighNumber = 'unexpectedLowOrHighNumberOfCalls';

export const bluePrintForCallsMetric = Object.freeze({
  [potentialProblemsCallsUnexpectedLowNumber]: t(
    'in-custom-dashboards:widgets.metricConfig.bluePrintForCallsMetric.unexpectedLowNumberOfCalls'
  ),
  [potentialProblemsCallsUnexpectedHighNumber]: t(
    'in-custom-dashboards:widgets.metricConfig.bluePrintForCallsMetric.unexpectedHighNumberOfCalls'
  ),
  [potentialProblemsCallsUnexpectedLowOrHighNumber]: t(
    'in-custom-dashboards:widgets.metricConfig.bluePrintForCallsMetric.unexpectedLowOrHighNumberOfCalls'
  )
});

export const ppFieldNames = Object.freeze({
  potentialProblems: 'potentialProblems',
  dataset: 'dataset',
  bluePrintForCallsMetric: 'bluePrintForCallsMetric'
});

export const addFieldsForPotentialProblems = (form, savedState) => {
  if (!savedState?.potentialProblems) {
    return form;
  }

  return form.put(
    ppFieldNames.potentialProblems,
    createMapForm()
      .put(
        ppFieldNames.dataset,
        createField({
          value: savedState.potentialProblems.dataset || '',
          validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, str => {
            if (str == null || (typeof str === 'string' && isBlank(str))) {
              return [
                {
                  severity: 'error',
                  message: t('in-custom-dashboards:widgets.formCompChart.potentialProblems.validation.missingDataset')
                }
              ];
            }
            return null;
          })
        })
      )
      .put(
        ppFieldNames.bluePrintForCallsMetric,
        createField({
          value:
            savedState.potentialProblems.bluePrintForCallsMetric || potentialProblemsCallsUnexpectedLowOrHighNumber,
          validator: composeAndShortCircuitOnError(
            notUndefinedValidator,
            stringValidator,
            notBlankValidator,
            buildEnumValidator(Object.keys(bluePrintForCallsMetric))
          )
        })
      )
  );
};

export const removeFieldsForPotentialProblems = form => {
  return form.remove(ppFieldNames.potentialProblems);
};
