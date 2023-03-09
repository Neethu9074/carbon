/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { applyEditMode } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { stringMaxLengthValidator } from 'in-services/validators/string';
import { SyntheticAlertConfigWithMetadata } from 'in-types';

const severityWarning = 5;

export const fieldNames = Object.freeze({
  tagFilterExpression: 'tagFilterExpression',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  severity: 'severity',
  description: 'description',
  name: 'name',
  syntheticTestIds: 'syntheticTestIds',
  id: 'id',
  rule: 'rule',
  timeThreshold: 'timeThreshold'
});

export default function alertFormDefinition(alertConfig: SyntheticAlertConfigWithMetadata, editMode: boolean): MapForm {
  const {
    tagFilterExpression,
    alertChannelIds = [],
    enabled = true,
    severity = severityWarning,
    description = '',
    name = '',
    syntheticTestIds = [],
    id = '',
    rule,
    timeThreshold
  } = alertConfig;

  const form = createMapForm()
    .put(
      fieldNames.tagFilterExpression,
      createField({
        value: tagFilterExpression ? fromBackendModel(tagFilterExpression) : [],
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
      })
    )
    .put(
      fieldNames.enabled,
      createField({
        value: enabled
      })
    )
    .put(
      fieldNames.syntheticTestIds,
      createField({
        value: syntheticTestIds
      })
    )
    .put(
      fieldNames.severity,
      createField({
        value: severity
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description
      })
    )
    .put(
      fieldNames.name,
      createField({
        value: name
      })
    )
    .put(
      fieldNames.rule,
      createField({
        value: rule
      })
    )
    .put(
      fieldNames.id,
      createField({
        value: id
      })
    )
    .put(
      fieldNames.timeThreshold,
      createMapForm()
        .put(
          'violationsCount',
          createField({
            value: timeThreshold.violationsCount
          })
        )
        .put(
          'type',
          createField({
            value: timeThreshold.type
          })
        )
    );

  return applyEditMode(form, editMode);
}
