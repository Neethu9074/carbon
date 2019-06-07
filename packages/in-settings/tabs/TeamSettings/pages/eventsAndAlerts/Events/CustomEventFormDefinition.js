import { createMapForm, createField, notBlankValidator } from 'formalistic';

import { parseQuery, scopeApplication, scopeDfq } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { mapConditionValue } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecifications';
import { getPlainMetricList, isBuiltInMetric, isMetricPercentile } from 'in-sdk/metrics';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import { queryValidationResultValidator, valid } from 'in-settings/validation';
import { isBlank } from 'in-services/util/string';
import { find } from 'in-services/arrayUtils';
import { plugins } from 'in-forge/constants';

export const dataSourceCustom = 'custom';
export const dataSourceBuiltIn = 'built-in';
export const dataSourceSystem = 'system';

export function createEventFormDefinition(event, isCreate) {
  const mutableEvent = getMutableEvent(event);
  const { name, entityType, query, triggering, description, expirationTime } = mutableEvent;
  const ruleAttributes = getRuleAttributes(mutableEvent);
  const { ruleType, metricName, severity } = ruleAttributes;

  const dataSource = getDataSourceFromEventSpecification(ruleType, entityType, metricName);
  const { applyOn, applicationName } = isCreate ? { applyOn: null, applicationName: null } : parseQuery(query);

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: name,
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: description,
        validator: notBlankValidator
      })
    )
    .put(
      'severity',
      createField({
        value: severity != null ? String(severity) : null,
        validator: severity => {
          if (Number(severity) === 0) {
            return [
              {
                severity: 'error',
                message: `Please select a severity`
              }
            ];
          }
          return null;
        }
      })
    )
    .put(
      'triggering',
      createField({
        value: triggering
      })
    )
    .put(
      'gracePeriod',
      createField({
        value: expirationTime != null ? String(expirationTime) : null,
        validator: notBlankValidator
      })
    )
    .put(
      'dataSource',
      createField({
        value: dataSource,
        validator: notBlankValidator
      })
    )
    .put(
      'applyOn',
      createField({
        value: applyOn,
        validator: notBlankValidator
      })
    );

  if (dataSource !== dataSourceSystem) {
    form = putAllDataSourceFields(form, event);
  } else {
    form = putSystemRuleSelection(form, ruleAttributes);
  }

  if (applyOn === scopeApplication) {
    form = putApplicationField(form, applicationName);
  } else if (applyOn === scopeDfq) {
    form = putQueryFields(form, event);
  }

  return form;
}

function putAllDataSourceFields(form, event) {
  const mutableEvent = getMutableEvent(event);
  const { entityType } = mutableEvent;
  const {
    metricName,
    metricLabel,
    metricFormat,
    conditionOperator,
    conditionValue: originalConditionValue
  } = getRuleAttributes(mutableEvent);

  let formatter = metricFormat;

  // FIXME fallback is only needed as long as not all plugins define a built-in metrics-catalog
  if (event && formatter === 'UNDEFINED') {
    const metricList = getPlainMetricList(entityType);
    const metricItem = find(metricList, _metric => _metric.value === metricName);

    if (metricItem) {
      formatter = numberFormatterToFormatterType(metricItem.formatter);
    }
  }

  const conditionValue = mapConditionValue(originalConditionValue, formatter);

  form = form
    .put(
      'entityType',
      createField({
        value: entityType,
        validator: notBlankOrDeprecatedValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: metricName,
        validator: metricName => {
          return metricName && metricName != '' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid metric.`
                }
              ];
        }
      })
    )
    .put(
      'conditionOperator',
      createField({
        value: conditionOperator,
        validator: notBlankValidator
      })
    )
    .put(
      'conditionValue',
      createField({
        value: conditionValue != null ? String(conditionValue) : '',
        validator(value) {
          if (isBlank(value)) {
            return [
              {
                severity: 'error',
                message: 'The value must not be blank.'
              }
            ];
          }

          const n = Number(value);
          if (isNaN(n)) {
            return [
              {
                severity: 'error',
                message: 'Please enter a number (use . as a decimal separator).'
              }
            ];
          }
          return null;
        }
      })
    )
    .put(
      'formatter',
      createField({
        value: formatter,
        validator: notBlankValidator
      })
    )
    .put(
      'label',
      createField({
        value: metricLabel,
        validator: notBlankValidator
      })
    );

  if (isMetricPercentile(entityType, metricName)) {
    form = putRollupField(form, event);
  } else {
    form = putWindowField(form, event);
    form = putAggregationField(form, event);
  }
  return form;
}

export function putWindowField(form, event) {
  return form.put(
    'window',
    createField({
      value: String(getRuleAttribute(event, 'window', '')),
      validator: notBlankValidator
    })
  );
}

export function putRollupField(form, event) {
  return form.put(
    'rollup',
    createField({
      value: String(getRuleAttribute(event, 'rollup', '')),
      validator: notBlankValidator
    })
  );
}

export function putAggregationField(form, event) {
  return form.put(
    'aggregation',
    createField({
      value: getRuleAttribute(event, 'aggregation', ''),
      validator: notBlankValidator
    })
  );
}

function removeAllDataSourceFields(form) {
  return form
    .remove('entityType')
    .remove('metricName')
    .remove('conditionOperator')
    .remove('conditionValue')
    .remove('formatter')
    .remove('label')
    .remove('rollup')
    .remove('window')
    .remove('aggregation');
}

function putSystemRuleSelection(form, ruleAttributes, systemRules) {
  let systemRule = ruleAttributes.systemRuleId;
  if (!systemRule && systemRules && systemRules.length > 0) {
    systemRule = systemRules[0].id;
  }

  return form.put(
    'systemRule',
    createField({
      value: systemRule,
      validator: notBlankValidator
    })
  );
}

export function updateFormDefinitionForDataSource(form, previousDataSource, event, systemRules) {
  const nextDataSource = form.get('dataSource') ? form.get('dataSource').value : null;
  if (previousDataSource !== dataSourceSystem && nextDataSource === dataSourceSystem) {
    form = removeAllDataSourceFields(form);
    form = putSystemRuleSelection(form, event, systemRules);
  } else if (previousDataSource === dataSourceSystem && nextDataSource !== dataSourceSystem) {
    form = putAllDataSourceFields(form, event);
    form = form.remove('systemRule');
  }

  if (previousDataSource !== nextDataSource) {
    form = form.setTouched(false, { recurse: true });
  }
  return form;
}

export function putApplicationField(form, applicationName) {
  return form.put(
    'application',
    createField({
      value: applicationName,
      validator: notBlankValidator
    })
  );
}

function notBlankOrDeprecatedValidator(entityType) {
  if (!entityType || entityType.trim().length === 0) {
    return [
      {
        severity: 'error',
        message: 'The entity type value must not be blank'
      }
    ];
  }

  if (isDeprecatedEntityType(entityType)) {
    return [
      {
        severity: 'error',
        message: `This entity type has been deprecated. Please choose a different type.`
      }
    ];
  }
  return null;
}

export function putQueryFields(form, event) {
  return form
    .put(
      'query',
      createField({
        value: event.get('query', ''),
        validator: notBlankValidator
      })
    )
    .put(
      'validationResult',
      createField({
        value: valid(),
        validator: queryValidationResultValidator
      })
    );
}

export function removeQueryFields(form) {
  return form.remove('query').remove('validationResult');
}

export function getDataSourceFromEventSpecification(ruleType, entityType, metricName) {
  if (ruleType === 'system') {
    return dataSourceSystem;
  }
  if (entityType && metricName) {
    return isBuiltInMetric(entityType, metricName) ? dataSourceBuiltIn : dataSourceCustom;
  }
}

export function isDeprecatedEntityType(entityType) {
  return Boolean(!plugins[entityType]);
}

function getMutableEvent(event) {
  return event ? event.toJS() : createCustomThresholdBasedEventSpecification();
}

function getRuleAttributes(event) {
  const { rules, rule } = event;
  let ruleType,
    metricName,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue,
    severity,
    systemRuleId,
    metricLabel,
    metricFormat;
  if (rules && rules.length === 1) {
    ruleType = rules[0].ruleType;
    metricName = rules[0].metricName;
    rollup = rules[0].rollup;
    window = rules[0].window;
    aggregation = rules[0].aggregation;
    conditionOperator = rules[0].conditionOperator;
    conditionValue = rules[0].conditionValue;
    severity = rules[0].severity;
    systemRuleId = rules[0].systemRuleId;
    metricLabel = rules[0].metricLabel;
    metricFormat = rules[0].metricFormat;
  } else if (rules && rules.length > 1) {
    if (__DEV__) {
      throw new Error('Multiple rules per event are not supported yet.');
    }
  } else if (rule) {
    ruleType = rule.ruleType;
    systemRuleId = rule.systemRuleId;
    severity = rule.severity;
  }
  return {
    ruleType,
    metricName,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue,
    severity,
    systemRuleId,
    metricLabel,
    metricFormat
  };
}

function getRuleAttribute(event, key, fallback) {
  const fromRules = event.getIn(['rules', '0', key]);
  if (fromRules != null) {
    return fromRules;
  }
  return event.getIn(['rule', key], fallback);
}
