/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { noValidationErrors } from 'formalistic/lib/validator';
import { createMapForm, createField } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';
import { buildEnumValidator } from 'in-services/validators/enum';
import { t } from 'in-i18n';

/**
 * Checks the existence of a potentialProblems field inside the given object.
 * @param metric {any|null|undefined}
 * @returns {boolean}
 */
export const hasPotentialProblems = metric => Boolean(metric?.potentialProblems);

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

/**
 * adds fields when savedState contains a potentialProblems field
 * set @potentialProblemsCallsUnexpectedHighNumber per default if no other value is given.
 */
export const addFieldsForPotentialProblems = (form, savedState) => {
  if (savedState?.potentialProblems) {
    return form.put(
      'potentialProblems',
      createMapForm().put(
        'bluePrintForCallsMetric',
        createField({
          value: savedState?.potentialProblems?.bluePrintForCallsMetric || potentialProblemsCallsUnexpectedHighNumber,
          validator: composeAndShortCircuitOnError(
            notUndefinedValidator,
            stringValidator,
            notBlankValidator,
            buildEnumValidator(Object.keys(bluePrintForCallsMetric))
          )
        })
      )
    );
  }
  return form;
};

export const removeFieldsForPotentialProblems = form => {
  return form.remove('potentialProblems');
};

/** Only reset, when PP has activated - else no change on the form needed */
export const resetPotentialProblemsFormFieldIfNeeded = form => {
  if (form.containsKey('potentialProblems')) {
    return removeFieldsForPotentialProblems(form);
  }
  return form;
};

/**
 * Validator to be used on the main form, containing both axis, y1 and y2.
 * It checks that the number of PP <= 1
 */
export const validatePotentialProblemsConstraints = data => {
  if (data == null) {
    return noValidationErrors;
  }
  const { y1, y2 } = data;
  if (y1 || y2) {
    const metrics = [...(y1?.toJS()?.metrics ?? []), ...(y2?.toJS()?.metrics ?? [])];

    const atLeastOnePPEnabled = metrics.find(hasPotentialProblems);
    if (metrics.length > 1 && atLeastOnePPEnabled) {
      return [
        {
          category: potentialProblemsCategory,
          severity: 'error',
          message: t('in-custom-dashboards:widgets.formCompChart.potentialProblems.onlyWorksWithOneMetricConfigured')
        }
      ];
    }
  }
  return null;
};

export const potentialProblemsCategory = 'PotentialProblemsError';
