import { createMapForm, createField, notBlankValidator } from 'formalistic';

export const fieldNames = Object.freeze({
  alertType: 'alertType',
  matchingOperator: 'matchingOperator',
  value: 'value',
  tagFilters: 'tagFilters',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  threshold: 'threshold'
});

export default function alertFormDefinition(alertFormValues = {}) {
  const {
    rule = '',
    tagFilters = [],
    alertChannelIds = [],
    enabled = true,
    triggering = false,
    severity = 5,
    description = '',
    name = '',
    threshold = ''
  } = alertFormValues;

  let form = createMapForm()
    .put(
      fieldNames.alertType,
      createField({
        value: rule && rule[fieldNames.alertType],
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.matchingOperator,
      createField({
        value: rule && rule[fieldNames.matchingOperator],
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.value,
      createField({
        value: rule && rule[fieldNames.value],
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.tagFilters,
      createField({
        value: tagFilters,
        validator: arrayNotEmptyValiadator
      })
    )
    .put(
      fieldNames.alertChannelIds,
      createField({
        value: alertChannelIds,
        validator: alertChannelsNotEmptyValiadator
      })
    )
    .put(
      fieldNames.enabled,
      createField({
        value: enabled
      })
    )
    .put(
      fieldNames.triggering,
      createField({
        value: triggering
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
        value: name,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.threshold,
      createField({
        value: threshold
      })
    );

  return form;
}

function alertChannelsNotEmptyValiadator(array) {
  if (!array || array.length === 0) {
    return [
      {
        severity: 'error',
        message: 'Please select at least one Alert Channel'
      }
    ];
  }
}

function arrayNotEmptyValiadator(array) {
  if (!array || array.length === 0) {
    return [
      {
        severity: 'error'
      }
    ];
  }
}
