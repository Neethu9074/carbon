/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm, ValidationResult } from 'formalistic';

import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { FormModelElement, fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { MAX_LABEL_LENGTH, MAX_LONG_STRING_LENGTH } from 'in-alerting/formFieldLengths';
import { SyntheticAlertConfig, TagFilter, VersionedConfig } from 'in-types';
import { stringMaxLengthValidator } from 'in-services/validators/string';

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
  timeThreshold: 'timeThreshold',
  gracePeriod: 'gracePeriod',
  customPayloadFields: 'customPayloadFields'
});

export default function alertFormDefinition(alertConfig: SyntheticAlertConfig & VersionedConfig): MapForm<any> {
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
    gracePeriod = 60000,
    timeThreshold
  } = alertConfig;

  const form = createMapForm()
    .put(
      fieldNames.tagFilterExpression,
      createField({
        value: tagFilterExpression ? fromBackendModel(tagFilterExpression) : [],
        validator: tagFilterValidator()
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
      fieldNames.name,
      createField({
        value: name,
        validator: stringMaxLengthValidator(MAX_LABEL_LENGTH)
      })
    )
    .put(
      fieldNames.description,
      createField({
        value: description,
        validator: stringMaxLengthValidator(MAX_LONG_STRING_LENGTH)
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
      fieldNames.gracePeriod,
      createField({
        value: gracePeriod
      })
    )
    .put(
      fieldNames.timeThreshold,
      createMapForm()
        .put(
          'violationsCount',
          createField({
            value: timeThreshold?.violationsCount
          })
        )
        .put(
          'type',
          createField({
            value: timeThreshold?.type
          })
        )
    )
    .put(fieldNames.customPayloadFields, createListFormForCustomPayloads(alertConfig.customPayloadFields ?? [], false));

  return form;
}

const isTagFilter = (element: FormModelElement): element is TagFilter => element.type === 'TAG_FILTER';

function tagFilterValidator(): (str?: FormModelElement[]) => ValidationResult | null {
  return (str?: any) => {
    if (str?.find?.((item: FormModelElement) => isTagFilter(item) && !item.value)) {
      return [
        {
          severity: 'error'
        }
      ];
    }
    return null;
  };
}
