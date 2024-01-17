/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { GenericInfraAlertRule } from '@instana/types';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notUndefinedValidator } from 'in-services/validators/undefined';
import { stringValidator } from 'in-services/validators/jsonType';
import { notBlankValidator } from 'in-services/validators/string';

export default function createRuleForm(rule: GenericInfraAlertRule): MapForm<any> {
  const baseForm = createBaseForm(rule);
  return baseForm;
}

function createBaseForm(rule: GenericInfraAlertRule): MapForm<any> {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: 'genericRule'
      })
    )
    .put(
      'entityType',
      createField({
        value: rule.entityType ?? ''
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? '',
        validator: composeAndShortCircuitOnError(notUndefinedValidator, stringValidator, notBlankValidator)
      })
    )
    .put(
      'aggregation',
      createField({
        value: rule.aggregation ?? 'MEAN'
      })
    )
    .put(
      'crossSeriesAggregation',
      createField({
        value: rule.crossSeriesAggregation
      })
    )
    .put(
      'regex',
      createField({
        value: rule.regex ?? false
      })
    );
}
