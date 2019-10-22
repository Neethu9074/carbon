import { createMapForm, createField, notBlankValidator } from 'formalistic';

export const fieldNames = Object.freeze({
  alertType: 'alertType',
  operator: 'operator',
  value: 'value',
  tagFilters: 'tagFilters',
  alertChannelIds: 'alertChannelIds',
  enabled: 'enabled',
  triggering: 'triggering',
  severity: 'severity',
  description: 'description',
  name: 'name',
  websiteId: 'websiteId',
  id: 'id',
  thresholdValue: 'thresholdValue',
  thresholdType: 'thresholdType'
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
    websiteId = '',
    id = '',
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
      fieldNames.operator,
      createField({
        value: rule && rule[fieldNames.operator],
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
        value: tagFilters
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
        value: name
      })
    )
    .put(
      fieldNames.websiteId,
      createField({
        value: websiteId
      })
    )
    .put(
      fieldNames.id,
      createField({
        value: id
      })
    )
    .put(
      fieldNames.thresholdValue,
      createField({
        value: (threshold && threshold[fieldNames.value]) || 0
      })
    )
    .put(
      fieldNames.thresholdType,
      createField({
        value: (threshold && threshold[fieldNames.thresholdType]) || 'staticThreshold'
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
