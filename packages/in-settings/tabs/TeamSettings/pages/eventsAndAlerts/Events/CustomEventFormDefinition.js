/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createField, createMapForm, notBlankValidator } from 'formalistic';

import {
  getAllBuiltInMetrics,
  isBuiltInDynamicMetric,
  isBuiltInPlainMetric,
  isMetricPercentile,
  toDynamicMetricStringValue,
  getMetricDefinition
} from 'in-sdk/metrics';
import { parseQuery, scopeApplication, scopeDfq } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { mapConditionValue } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/util';
import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecifications';
import { numberFormatterToFormatterType } from 'in-services/formatters/number';
import { queryValidationResultValidator, valid } from 'in-settings/validation';
import { isBlank } from 'in-services/util/string';
import { find } from 'in-services/arrayUtils';
import { plugins } from 'in-forge/constants';

export const ruleTypeEntityVerification = 'entity_verification';
export const dataSourceCustom = 'custom';
export const dataSourceBuiltIn = 'built-in';
export const dataSourceSystem = 'system';

export const offlineEventDetection = Object.freeze({
  id: 'entity.offline',
  name: 'Offline event detection'
});

export const entityVerification = Object.freeze({
  id: 'entity.on.host.verification', // this id is UI internal only, because we need to group it under systemRules
  name: 'Hosts that do not have matching entities running on them'
});

export const systemRules = Object.freeze([offlineEventDetection, entityVerification]);

export function createEventFormDefinition(eventSpec, isCreate) {
  const mutableEvent = getMutableEventSpecification(eventSpec);
  const { name, entityType, query, triggering, description, expirationTime } = mutableEvent;
  const ruleAttributes = getRuleAttributes(mutableEvent);
  const { ruleType, severity } = ruleAttributes;

  const dataSource = getDataSourceFromEventSpecification(entityType, ruleAttributes);
  const { applyOn, applicationName, applicationIds } = isCreate
    ? { applyOn: null, applicationName: null, applicationIds: [] }
    : parseQuery(query);

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
    form = putAllDataSourceFields(form, eventSpec);
  } else {
    form = putSystemRuleSelection(form, ruleAttributes);
    if (ruleType === ruleTypeEntityVerification) {
      form = putAllEntityVerificationFields(form, eventSpec);
    }
  }

  if (applyOn === scopeApplication) {
    form = putApplicationField(form, applicationName);
    form = putApplicationIdField(form, applicationIds);
  } else if (applyOn === scopeDfq) {
    form = putQueryFields(form, eventSpec);
  }

  return form;
}

function putAllDataSourceFields(form, eventSpec) {
  const mutableEvent = getMutableEventSpecification(eventSpec);
  const { entityType } = mutableEvent;
  const {
    metricName,
    metricPlaceholderValue,
    metricPlaceholderOperator,
    metricFormat,
    conditionOperator,
    conditionValue: originalConditionValue
  } = getRuleAttributes(mutableEvent);

  let formatter = metricFormat;
  // FIXME fallback is only needed as long as not all plugins define a built-in metrics-catalog in the backend
  if (eventSpec && formatter === 'UNDEFINED') {
    const metricList = getAllBuiltInMetrics(entityType);
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
    );

  if (isMetricPercentile(entityType, metricName)) {
    form = putRollupField(form, eventSpec);
  } else {
    form = putWindowField(form, eventSpec);
    form = putAggregationField(form, eventSpec);
  }

  if (isBuiltInDynamicMetric(entityType, metricName)) {
    form = putMetricPatternOperator(form, metricPlaceholderOperator);
    if (metricPlaceholderOperator !== 'any') {
      form = putMetricPatternPlaceholder(form, metricPlaceholderValue);
    }
  }

  return form;
}

export function putMetricPatternOperator(form, metricPlaceholderOperator) {
  return form.put(
    'metricPatternOperator',
    createField({
      value: metricPlaceholderOperator ?? 'is',
      validator: notBlankValidator
    })
  );
}

export function putMetricPatternPlaceholder(form, metricPlaceholderValue) {
  return form.put(
    'metricPatternPlaceholder',
    createField({
      value: metricPlaceholderValue ?? '',
      validator: notBlankValidator
    })
  );
}

function putAllEntityVerificationFields(form, event) {
  const { matchingEntityType, matchingOperator, matchingEntityLabel, offlineDuration } = getRuleAttributes(
    getMutableEventSpecification(event)
  );

  return form
    .put(
      'matchingEntityType',
      createField({
        value: matchingEntityType,
        validator: notBlankValidator
      })
    )
    .put(
      'matchingOperator',
      createField({
        value: matchingOperator ?? 'is',
        validator: notBlankValidator
      })
    )
    .put(
      'matchingEntityLabel',
      createField({
        value: matchingEntityLabel,
        validator: notBlankValidator
      })
    )
    .put(
      'offlineDuration',
      createField({
        value: String(offlineDuration),
        validator: notBlankValidator
      })
    );
}

export function putWindowField(form, eventSpec) {
  return form.put(
    'window',
    createField({
      value: String(getRuleAttribute(eventSpec, 'window', '')),
      validator: notBlankValidator
    })
  );
}

export function putRollupField(form, eventSpec) {
  return form.put(
    'rollup',
    createField({
      value: String(getRuleAttribute(eventSpec, 'rollup', '')),
      validator: notBlankValidator
    })
  );
}

export function putAggregationField(form, eventSpec) {
  return form.put(
    'aggregation',
    createField({
      value: getRuleAttribute(eventSpec, 'aggregation', ''),
      validator: notBlankValidator
    })
  );
}

function removeAllDataSourceFields(form) {
  form = removeAllEntityVerificationFields(form);
  form = removeAllMetricPatternFields(form);
  return form
    .remove('entityType')
    .remove('metricName')
    .remove('metricPatternOperator')
    .remove('metricPatternPlaceholder')
    .remove('conditionOperator')
    .remove('conditionValue')
    .remove('formatter')
    .remove('rollup')
    .remove('window')
    .remove('aggregation');
}

function removeAllEntityVerificationFields(form) {
  return form
    .remove('matchingEntityType')
    .remove('matchingOperator')
    .remove('matchingEntityLabel')
    .remove('offlineDuration');
}

function removeAllMetricPatternFields(form) {
  return form.remove('metricPatternOperator').remove('metricPatternPlaceholder');
}

function putSystemRuleSelection(form, ruleAttributes, systemRules) {
  let systemRule = ruleAttributes.systemRuleId;
  if (!systemRule && systemRules && systemRules.length > 0) {
    systemRule = systemRules[0].id;
  }

  if (!systemRule && ruleAttributes.ruleType === ruleTypeEntityVerification) {
    systemRule = entityVerification.id;
  }

  return form.put(
    'systemRule',
    createField({
      value: systemRule,
      validator: notBlankValidator
    })
  );
}

export function updateFormDefinitionForSystemRule(form, previousDataSource, event) {
  const nextDataSource = form.get('systemRule') ? form.get('systemRule').value : null;

  if (nextDataSource === entityVerification.id) {
    form = putAllEntityVerificationFields(form, event);
  }

  if (nextDataSource === offlineEventDetection.id) {
    form = removeAllEntityVerificationFields(form);
  }

  if (previousDataSource !== nextDataSource) {
    form = form.setTouched(false, { recurse: true });
  }

  return form;
}

export function updateFormDefinitionForDataSource(form, previousDataSource, eventSpec, systemRules) {
  const nextDataSource = form.get('dataSource')?.value;

  if (previousDataSource !== dataSourceSystem && nextDataSource === dataSourceSystem) {
    const { ruleType } = getRuleAttributes(getMutableEventSpecification(eventSpec));
    form = removeAllDataSourceFields(form);

    if (ruleType === ruleTypeEntityVerification) {
      form = putAllEntityVerificationFields(form, eventSpec);
    }

    form = putSystemRuleSelection(form, eventSpec, systemRules);
  } else if (previousDataSource === dataSourceSystem && nextDataSource !== dataSourceSystem) {
    form = putAllDataSourceFields(form, eventSpec);
    form = form.remove('systemRule');
    form = removeAllEntityVerificationFields(form);
  } else if (previousDataSource) {
    form = removeAllMetricPatternFields(form);
    form = form.updateIn(['entityType'], field => field.setValue(null));
    form = form.updateIn(['metricName'], field => field.setValue(null));
  }

  if (previousDataSource !== nextDataSource) {
    form = form.setTouched(false, { recurse: true });
  }
  return form;
}

function selectedApplicationsValidator(selectedApplications) {
  if (selectedApplications.size === 0) {
    return [
      {
        severity: 'error',
        message: 'Please select at least one application.'
      }
    ];
  }
}

export function putApplicationField(form, applicationName) {
  return form.put(
    'application',
    createField({
      value: applicationName
    })
  );
}

export function putApplicationIdField(form, applicationIds) {
  return form.put(
    'applicationIds',
    createField({
      value: applicationIds,
      validator: selectedApplicationsValidator
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

export function putQueryFields(form, eventSpec) {
  return form
    .put(
      'query',
      createField({
        value: eventSpec.get('query', ''),
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

export function getDataSourceFromEventSpecification(entityType, ruleAttributes) {
  const { ruleType, metricName } = ruleAttributes;

  if (ruleType === 'system' || ruleType === ruleTypeEntityVerification) {
    return dataSourceSystem;
  }
  if (entityType && metricName) {
    return isBuiltInPlainMetric(entityType, metricName) || isBuiltInDynamicMetric(entityType, metricName)
      ? dataSourceBuiltIn
      : dataSourceCustom;
  }
}

export function isDeprecatedEntityType(entityType) {
  return Boolean(!plugins[entityType]);
}

function getMutableEventSpecification(eventSpec) {
  return eventSpec ? eventSpec.toJS() : createCustomThresholdBasedEventSpecification();
}

function getRuleAttributes(eventSpec) {
  const { rules, rule, entityType } = eventSpec;

  let ruleType,
    metricName,
    metricPlaceholderValue,
    metricPlaceholderOperator,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue,
    severity,
    systemRuleId,
    metricFormat,
    matchingEntityType,
    matchingOperator,
    matchingEntityLabel,
    offlineDuration;
  if (rules && rules.length === 1) {
    ruleType = rules[0].ruleType;

    if (rules[0].metricName) {
      metricName = rules[0].metricName;

      // compatibility for dynamic built-in metrics using a full metric name: handle as metricPattern
      const { metricPattern } = getMetricDefinition(entityType, rules[0].metricName);
      if (metricPattern) {
        const metricValueMatch = metricName.match(metricPattern.pattern);
        if (metricValueMatch.length > 1) {
          metricPlaceholderValue = metricValueMatch[1];
          metricPlaceholderOperator = 'is';
          metricName = toDynamicMetricStringValue(metricPattern.pre, metricPattern.post);
        }
      }
    } else if (rules[0].metricPattern) {
      const metricPattern = rules[0].metricPattern;
      metricPlaceholderValue = metricPattern.placeholder;
      metricPlaceholderOperator = metricPattern.operator;
      metricName = toDynamicMetricStringValue(metricPattern.prefix, metricPattern.postfix);
    }

    rollup = rules[0].rollup;
    window = rules[0].window;
    aggregation = rules[0].aggregation;
    conditionOperator = rules[0].conditionOperator;
    conditionValue = rules[0].conditionValue;
    severity = rules[0].severity;
    systemRuleId = rules[0].systemRuleId;
    metricFormat = rules[0].metricFormat;
    matchingEntityType = rules[0].matchingEntityType;
    matchingOperator = rules[0].matchingOperator;
    matchingEntityLabel = rules[0].matchingEntityLabel;
    offlineDuration = rules[0].offlineDuration;
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
    metricPlaceholderValue,
    metricPlaceholderOperator,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue,
    severity,
    systemRuleId,
    metricFormat,
    matchingEntityType,
    matchingOperator,
    matchingEntityLabel,
    offlineDuration
  };
}

function getRuleAttribute(eventSpec, key, fallback) {
  if (!eventSpec) {
    return fallback;
  }

  const fromRules = eventSpec.getIn(['rules', '0', key]);
  if (fromRules != null) {
    return fromRules;
  }
  return eventSpec.getIn(['rule', key], fallback);
}
