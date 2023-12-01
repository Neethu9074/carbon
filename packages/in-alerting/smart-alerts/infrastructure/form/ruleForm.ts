/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { GenericInfraAlertRule } from '@instana/types';

export default function createRuleForm(rule: GenericInfraAlertRule): MapForm<any> {
  const baseForm = createBaseForm(rule);
  return baseForm;
}

function createBaseForm(rule: GenericInfraAlertRule): MapForm<any> {
  return createMapForm()
    .put(
      'alertType',
      createField({
        value: rule.alertType ?? 'genericRule'
      })
    )
    .put(
      'metricName',
      createField({
        value: rule.metricName ?? ''
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
        value: rule.crossSeriesAggregation ?? 'null'
      })
    );
}
