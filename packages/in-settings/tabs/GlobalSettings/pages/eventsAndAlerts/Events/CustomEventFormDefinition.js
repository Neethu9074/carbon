/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, createListForm } from 'formalistic';

import {
  getAllBuiltInMetrics,
  isBuiltInDynamicMetric,
  isBuiltInPlainMetric,
  isBackendAggregatedPercentileMetric,
  toDynamicMetricStringValue,
  getMetricDefinition
} from 'in-sdk/metrics';
import {
  parseQuery,
  scopeApplication,
  scopeDfq,
  scopeHostsByTag
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/shared';
import {
  getBuiltInMetricInfo,
  getCustomMetricInfo
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customMetricUtils';
import {
  isDeprecatedAppDataEntityType,
  mapConditionValue
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/util';
import { customEventRulesValidator } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/customEventRuleValidations';
import { EQUALS, IS_EMPTY, NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { getFormatterType, positiveNumber } from 'in-services/formatters/number';
import { notBlankValidator } from 'in-services/validators/string';
import { isBlank } from 'in-services/util/string';
import { find } from 'in-services/arrayUtils';
import { plugins } from 'in-forge/constants';
import { t } from 'in-i18n';

export const ruleTypeOfflineEventDetection = 'system';
export const ruleTypeEntityVerification = 'entity_verification';
export const ruleTypeHostAvailability = 'host_availability';
export const ruleTypeEntityCount = 'entity_count';
export const ruleTypeEntityCountVerification = 'entity_count_verification';
export const dataSourceCustom = 'custom';
export const dataSourceBuiltIn = 'built-in';
export const dataSourceSystem = 'system';

export const offlineEventDetection = Object.freeze({
  id: 'entity.offline',
  name: t('in-settings:tabs.offlineEventDetection')
});

export const entityVerification = Object.freeze({
  id: 'entity.on.host.verification', // this id is UI internal only, because we need to group it under systemRules
  name: t('in-settings:tabs.hostsThatDoNotHaveMatchingEntitiesRunningOnThem')
});

export const hostAvailabilityDetection = Object.freeze({
  id: 'host.availability.detection', // this id is UI internal only, because we need to group it under systemRules
  name: t('in-settings:tabs.hostAvailabilityDetection')
});

/**
 * System rule for entity count.
 * <p>
 * For users, we call it "Instana Agent Count" for now, as long as we implicitly fixate the {@code entityType} field
 * to {@code instanaAgent}.
 */
export const entityCountDetection = Object.freeze({
  id: 'entity.count.detection', // this id is UI internal only, because we need to group it under systemRules
  name: t('in-settings:tabs.instanaAgentCountDetection')
});

export const entityCountVerification = Object.freeze({
  id: 'entity.count.on.host.verification', // this id is UI internal only, because we need to group it under systemRules
  name: t('in-settings:tabs.entityCountVerification')
});

export const systemRules = Object.freeze([
  offlineEventDetection,
  entityVerification,
  hostAvailabilityDetection,
  entityCountDetection,
  entityCountVerification
]);

const defaultScopeFields = Object.freeze({
  applyOn: null,
  applicationName: null,
  applicationIds: [],
  tagValueForHostAvailability: null,
  tagOperatorForHostAvailability: null
});

function getScopeFields(isCreate, query, ruleType, tagFilter) {
  if (isCreate) {
    return defaultScopeFields;
  } else {
    if (ruleType === ruleTypeEntityCount) {
      return defaultScopeFields;
    }

    if (ruleType === ruleTypeHostAvailability && tagFilter !== null) {
      return {
        ...defaultScopeFields,
        applyOn: scopeHostsByTag,
        tagValueForHostAvailability: tagFilter?.stringValue,
        tagOperatorForHostAvailability: tagFilter?.operator
      };
    }
    return { ...defaultScopeFields, ...parseQuery(query) };
  }
}

const conditionValueValidator = function (value) {
  if (isBlank(value)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.theValueMustNotBeBlank')
      }
    ];
  }

  const n = Number(value);
  if (isNaN(n)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseEnterANumberUseAsADecimalSeparator')
      }
    ];
  }
  return null;
};
const metricNameValidator = metricName => {
  return metricName && metricName !== '' && metricName.length > 0
    ? null
    : [
        {
          severity: 'error',
          message: t('in-settings:tabs.pleaseEnterAValidMetric')
        }
      ];
};

export function createEventFormDefinition(mutableEvent, isCreate) {
  const eventSpec = mutableEvent; // TODO refactor in next step.
  const { name, entityType, query, triggering, description, expirationTime } = mutableEvent;
  const ruleAttributes = getRuleAttributes(mutableEvent);
  const { ruleType, severity, tagFilter } = ruleAttributes;

  const dataSource = getDataSourceFromEventSpecification(entityType, ruleAttributes);
  const { applyOn, applicationName, applicationIds, tagValueForHostAvailability, tagOperatorForHostAvailability } =
    getScopeFields(isCreate, query, ruleType, tagFilter);

  function millistoThresholdObj(ms = 300000) {
    return ms % 3600000 === 0 ? { amount: ms / 3600000, unit: 'HOURS' } : { amount: ms / 60000, unit: 'MINUTES' };
  }

  const {
    transientEventEnabled = false,
    transientEventThreshold = 300000,
    transientEventAlertMuted = false
  } = mutableEvent;

  const transientEventThresholdObj = millistoThresholdObj(transientEventThreshold);

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
                message: t('in-settings:tabs.pleaseSelectASeverity')
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
      'transientEventEnabled',
      createField({
        value: transientEventEnabled
      })
    )
    .put(
      'transientEventThreshold',
      createField({
        value: transientEventThresholdObj,
        validator: positiveNumber
      })
    )
    .put(
      'transientEventAlertMuted',
      createField({
        value: transientEventAlertMuted
      })
    );

  form = putActionField(form, mutableEvent.actionIds);

  if (dataSource !== dataSourceSystem) {
    form = putMetricDataSourceFields(form, eventSpec, applyOn);
  } else {
    form = putSystemRuleSelection(form, ruleAttributes);
    if (ruleType === ruleTypeOfflineEventDetection) {
      form = putOfflineEventDetectionFields(form, applyOn);
    }
    if (ruleType === ruleTypeEntityVerification) {
      form = putEntityVerificationFields(form, eventSpec, applyOn);
    }
    if (ruleType === ruleTypeHostAvailability) {
      form = putHostAvailabilityDetectionFields(form, eventSpec, applyOn);
    }
    if (ruleType === ruleTypeEntityCount) {
      form = putEntityCountDetectionFields(form, eventSpec);
    }
    if (ruleType === ruleTypeEntityCountVerification) {
      form = putEntityCountVerificationFields(form, eventSpec, applyOn);
    }
  }

  if (applyOn === scopeApplication) {
    form = putApplicationField(form, applicationName);
    form = putApplicationIdField(form, applicationIds);
  } else if (applyOn === scopeDfq) {
    form = putQueryFields(form, eventSpec);
  } else if (applyOn === scopeHostsByTag) {
    form = putScopeByHostsFields(form, tagValueForHostAvailability, tagOperatorForHostAvailability);
  }

  return form;
}

function putApplyOnField(form, applyOn = null) {
  return form.put(
    'applyOn',
    createField({
      value: applyOn,
      validator: notBlankValidator
    })
  );
}

function putMetricDataSourceFields(form, eventSpec, applyOn = null) {
  const { entityType, ruleLogicalOperator } = eventSpec;

  form = putApplyOnField(form, applyOn).put(
    'entityType',
    createField({
      value: entityType,
      validator: notBlankOrDeprecatedValidator
    })
  );

  const rulesFormList = createListForm({
    items: (eventSpec.rules ?? []).map(rule => putMetricDataSourceFieldsForOneRule(entityType, rule)),
    validator: customEventRulesValidator
  });

  return form.put('rules', rulesFormList).put(
    'ruleLogicalOperator',
    createField({
      value: ruleLogicalOperator ?? 'AND',
      validator: notBlankValidator
    })
  );
}

export function putMetricDataSourceFieldsForOneRule(entityType, rule) {
  const {
    metricName,
    metricPlaceholderValue,
    metricPlaceholderOperator,
    metricFormat,
    conditionOperator,
    conditionValue: originalConditionValue,
    aggregation
  } = getRuleAttributesForEntityType(entityType, rule);

  const formatter = metricTypeOrBuiltinFormatterIfMissing(metricFormat, entityType, metricName);
  const conditionValue = mapConditionValue(originalConditionValue, formatter, aggregation);

  let form = createMapForm()
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
        validator: metricNameValidator
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
        validator: conditionValueValidator
      })
    )
    .put(
      'formatter',
      createField({
        value: formatter,
        validator: notBlankValidator
      })
    );

  if (isBackendAggregatedPercentileMetric(entityType, metricName)) {
    form = form.put(
      'rollup',
      createField({
        value: String(rule.rollup ?? ''),
        validator: notBlankValidator
      })
    );
  } else {
    form = form.put(
      'window',
      createField({
        value: String(rule.window ?? ''),
        validator: notBlankValidator
      })
    );
    form = form.put(
      'aggregation',
      createField({
        value: rule.aggregation ?? '',
        validator: notBlankValidator
      })
    );
  }

  if (isBuiltInDynamicMetric(entityType, metricName)) {
    form = updateMetricPatternForms(form, metricPlaceholderOperator, metricPlaceholderValue);
  }

  return form;
}

function putMetricPatternOperator(form, metricPlaceholderOperator) {
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

function putOfflineEventDetectionFields(form, applyOn = null) {
  return putApplyOnField(form, applyOn);
}

function putEntityVerificationFields(form, event, applyOn = null) {
  const { matchingEntityType, matchingOperator, matchingEntityLabel, offlineDuration } = getRuleAttributes(event);

  return putApplyOnField(form, applyOn)
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

function putEntityCountVerificationFields(form, event, applyOn = null) {
  const { matchingEntityType, matchingOperator, matchingEntityLabel, conditionOperator, conditionValue } =
    getRuleAttributes(event);

  return putApplyOnField(form, applyOn)
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
        validator: conditionValueValidator
      })
    );
}

function putHostAvailabilityDetectionFields(form, event, applyOn = null) {
  const { offlineDuration, closeAfter } = getRuleAttributes(event);

  return putApplyOnField(form, applyOn)
    .put(
      'offlineDuration',
      createField({
        value: offlineDuration ? String(offlineDuration) : undefined,
        validator: notBlankValidator
      })
    )
    .put(
      'closeAfter',
      createField({
        value: closeAfter ? String(closeAfter) : undefined,
        validator: notBlankValidator
      })
    );
}

function putEntityCountDetectionFields(form, event) {
  const { conditionOperator, conditionValue } = getRuleAttributes(event);

  return form
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
        validator: conditionValueValidator
      })
    );
}

function putWindowField(form, eventSpec) {
  return form.put(
    'window',
    createField({
      value: String(eventSpec?.rules?.[0]?.window ?? ''),
      validator: notBlankValidator
    })
  );
}

function putRollupField(form, eventSpec) {
  return form.put(
    'rollup',
    createField({
      value: String(eventSpec?.rules?.[0]?.rollup ?? ''),
      validator: notBlankValidator
    })
  );
}

function putAggregationField(form, eventSpec) {
  return form.put(
    'aggregation',
    createField({
      value: eventSpec?.rules?.[0]?.aggregation ?? '',
      validator: notBlankValidator
    })
  );
}

function removeMetricDataSourceFields(form) {
  form = removeMetricPatternFields(form);
  return form.remove('rules').remove('entityType').remove('applyOn');
}

function removeEntityVerificationFields(form) {
  return form
    .remove('matchingEntityType')
    .remove('matchingOperator')
    .remove('matchingEntityLabel')
    .remove('offlineDuration')
    .remove('applyOn');
}

function removeEntityCountVerificationFields(form) {
  return form
    .remove('matchingEntityType')
    .remove('matchingOperator')
    .remove('matchingEntityLabel')
    .remove('applyOn')
    .remove('conditionOperator')
    .remove('conditionValue');
}

function removeHostAvailabilityDetectionFields(form) {
  return form.remove('offlineDuration').remove('closeAfter').remove('applyOn');
}

function removeEntityCountDetectionFields(form) {
  return form.remove('conditionOperator').remove('conditionValue');
}

function removeMetricPatternFields(form) {
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

  if (!systemRule && ruleAttributes.ruleType === ruleTypeHostAvailability) {
    systemRule = hostAvailabilityDetection.id;
  }

  if (!systemRule && ruleAttributes.ruleType === ruleTypeEntityCount) {
    systemRule = entityCountDetection.id;
  }

  if (!systemRule && ruleAttributes.ruleType === ruleTypeEntityCountVerification) {
    systemRule = entityCountVerification.id;
  }

  if (systemRule !== entityCountDetection.id) {
    form = putApplyOnField(form);
  }

  return form.put(
    'systemRule',
    createField({
      value: systemRule,
      validator: notBlankValidator
    })
  );
}

export function updateFormDefinitionForSystemRule(form, previousSystemRule, event) {
  const nextSystemRule = form.get('systemRule') ? form.get('systemRule').value : null;

  if (nextSystemRule === entityVerification.id) {
    form = removeHostAvailabilityDetectionFields(form);
    form = removeEntityCountDetectionFields(form);
    form = removeEntityCountVerificationFields(form);
    form = putEntityVerificationFields(form, event);
  }

  if (nextSystemRule === entityCountVerification.id) {
    form = removeEntityVerificationFields(form);
    form = removeHostAvailabilityDetectionFields(form);
    form = removeEntityCountDetectionFields(form);
    form = putEntityCountVerificationFields(form, event);
  }

  if (nextSystemRule === hostAvailabilityDetection.id) {
    form = removeEntityVerificationFields(form);
    form = removeEntityCountDetectionFields(form);
    form = removeEntityCountVerificationFields(form);
    form = putHostAvailabilityDetectionFields(form, event);
  }

  if (nextSystemRule === entityCountDetection.id) {
    form = removeEntityVerificationFields(form);
    form = removeHostAvailabilityDetectionFields(form);
    form = removeEntityCountVerificationFields(form);
    form = putEntityCountDetectionFields(form, event);
  }

  if (nextSystemRule === offlineEventDetection.id) {
    form = removeEntityVerificationFields(form);
    form = removeHostAvailabilityDetectionFields(form);
    form = removeEntityCountDetectionFields(form);
    form = removeEntityCountVerificationFields(form);
    form = putOfflineEventDetectionFields(form, event);
  }

  if (previousSystemRule !== nextSystemRule) {
    if (form.containsKey('applyOn')) {
      form = form.updateIn(['applyOn'], field => field.setValue(null).setTouched(false));
    }
    form = form.setTouched(false, { recurse: true });
  }

  return form;
}

export function updateFormDefinitionForDataSource(form, previousDataSource, eventSpec, systemRules) {
  const nextDataSource = form.get('dataSource')?.value;

  if (previousDataSource !== dataSourceSystem && nextDataSource === dataSourceSystem) {
    // switching to system rule
    form = removeMetricDataSourceFields(form);
    form = putSystemRuleSelection(form, eventSpec, systemRules);
  } else if (previousDataSource === dataSourceSystem && nextDataSource !== dataSourceSystem) {
    // switching from system rule to built-in- or custom-rules
    form = putMetricDataSourceFields(form, {});
    form = form.remove('systemRule');
    form = removeEntityVerificationFields(form);
    form = removeHostAvailabilityDetectionFields(form);
    form = removeEntityCountDetectionFields(form);
    form = putApplyOnField(form);
  } else if (previousDataSource && nextDataSource !== previousDataSource) {
    // switching between built-in- and custom-rules
    form = removeMetricPatternFields(form);
    // clear multi-conditions, when switching between non-system configs
    form = form.put(
      'rules',
      createListForm({
        validator: customEventRulesValidator
      })
    );
    form = form.updateIn(['entityType'], field => field.setValue(null));
  }

  if (previousDataSource !== nextDataSource) {
    form = form.setTouched(false, { recurse: true });
  }
  return form;
}

function selectedApplicationsValidator(selectedApplications) {
  if (selectedApplications.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneApplication')
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

export function putScopeByHostsFields(form, tagValueForHostAvailability, tagOperatorForHostAvailability) {
  const tagOperator = tagOperatorForHostAvailability ?? EQUALS;

  const formWithTagOperator = form.put(
    'tagOperator',
    createField({
      value: tagOperator
    })
  );

  if (![IS_EMPTY, NOT_EMPTY].includes(tagOperator)) {
    return putTagValueField(formWithTagOperator, tagValueForHostAvailability);
  }

  return formWithTagOperator;
}

export function putTagValueField(form, tagValue) {
  return form.put(
    'tagValue',
    createField({
      value: tagValue ?? '',
      validator: notBlankValidator
    })
  );
}

export function removeTagValueField(form) {
  return form.remove('tagValue');
}

export function removeScopeByHostsField(form) {
  return form.remove('tagValue').remove('tagOperator');
}

export function putActionField(form, actionIds) {
  return form.put(
    'actionIds',
    createField({
      value: actionIds ?? []
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
        message: t('in-settings:tabs.theEntityTypeValueMustNotBeBlank')
      }
    ];
  }

  if (isDeprecatedEntityType(entityType)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.thisEntityTypeHasBeenDeprecated')
      }
    ];
  }
  return null;
}

export function putQueryFields(form, eventSpec) {
  return form.put(
    'query',
    createField({
      value: eventSpec.query ?? '',
      validator: notBlankValidator
    })
  );
}

export function removeQueryFields(form) {
  return form.remove('query');
}

export function getDataSourceFromEventSpecification(entityType, ruleAttributes) {
  const { ruleType, metricName } = ruleAttributes;

  if (isSystemDataSource(ruleType)) {
    return dataSourceSystem;
  }

  if (entityType && metricName) {
    return isBuiltInPlainMetric(entityType, metricName) || isBuiltInDynamicMetric(entityType, metricName)
      ? dataSourceBuiltIn
      : dataSourceCustom;
  }
}

function isSystemDataSource(ruleType) {
  return (
    ruleType === ruleTypeOfflineEventDetection ||
    ruleType === ruleTypeEntityVerification ||
    ruleType === ruleTypeHostAvailability ||
    ruleType === ruleTypeEntityCount ||
    ruleType === ruleTypeEntityCountVerification
  );
}

export function isHostAvailabilitySystemRule(form) {
  return form.get('systemRule')?.value === hostAvailabilityDetection.id;
}

export function isEntityCountSystemRule(form) {
  return form.get('systemRule')?.value === entityCountDetection.id;
}

export function isDeprecatedEntityType(entityType) {
  return Boolean(!plugins[entityType]);
}

function getRuleAttributes(eventSpec) {
  const { rules, rule } = eventSpec;

  /* to avoid breaking existing form, just use first rule, and
   * ignore other rules here */
  if (rules && rules.length >= 1) {
    const { entityType } = eventSpec;
    const firstRule = rules[0];
    return getRuleAttributesForEntityType(entityType, firstRule);
  } else if (rule) {
    // TODO: this case should not exist in the future - need more rework

    const { ruleType, systemRuleId, severity } = rule;

    return {
      ruleType,
      severity,
      systemRuleId
    };
  }
  return {};
}

function getRuleAttributesForEntityType(entityType, rule) {
  const { metricName, metricPattern } = rule;

  let metricPlaceholderValue, metricPlaceholderOperator;
  let dynamicMetricName = metricName;

  if (metricName) {
    // compatibility for dynamic built-in metrics using a full metric name: handle as metricPattern
    const { metricPattern } = getMetricDefinition(entityType, metricName);

    if (metricPattern) {
      const metricValueMatch = metricName.match(metricPattern.pattern);
      if (metricValueMatch.length > 1) {
        metricPlaceholderValue = metricValueMatch[1];
        metricPlaceholderOperator = 'is';
        dynamicMetricName = toDynamicMetricStringValue(metricPattern.pre, metricPattern.post);
      }
    }
  } else if (metricPattern) {
    metricPlaceholderValue = metricPattern.placeholder;
    metricPlaceholderOperator = metricPattern.operator;
    dynamicMetricName = toDynamicMetricStringValue(metricPattern.prefix, metricPattern.postfix);
  }

  return {
    ...rule,
    metricName: dynamicMetricName ?? metricName,
    metricPlaceholderValue,
    metricPlaceholderOperator
  };
}

export function isPercentile(form) {
  if (!form || !form.get('entityType') || !form.get('metricName')) {
    return false;
  }

  const metricName = form.get('metricName').value;
  const entityType = form.get('entityType').value;
  return isBackendAggregatedPercentileMetric(entityType, metricName);
}

export function isBuiltInDataSourceSelected(form) {
  return form.get('dataSource').value === dataSourceBuiltIn;
}

export function isCustomDataSourceSelected(form) {
  return form.get('dataSource').value === dataSourceCustom;
}

export function isSystemRuleDataSourceSelected(form) {
  return form.get('dataSource').value === dataSourceSystem;
}

export function canHaveMultipleConditions(form) {
  const entityType = form.get('entityType')?.value;
  const deprecatedAppDataEntityType = isDeprecatedAppDataEntityType(entityType);
  const builtInDataSourceSelected = isBuiltInDataSourceSelected(form);
  const customDataSourceSelected = isCustomDataSourceSelected(form);

  return (builtInDataSourceSelected || customDataSourceSelected) && !deprecatedAppDataEntityType;
}

export function onChangeApplyOn(applyOn, onChange) {
  let updateFormDefinition;

  if (applyOn === scopeDfq) {
    updateFormDefinition = (form, eventSpec) => {
      form = form.remove('application');
      form = removeScopeByHostsField(form);
      form = putQueryFields(form, eventSpec);
      return form.updateIn(['query'], f => {
        return f.setValue('');
      });
    };
  } else if (applyOn === scopeApplication) {
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = removeScopeByHostsField(form);
      form = putApplicationField(form, null);
      form = putApplicationIdField(form, []);
      return form;
    };
  } else if (applyOn === scopeHostsByTag) {
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = form.remove('application');
      form = form.remove('applicationIds');
      form = putScopeByHostsFields(form);

      return form;
    };
  } else {
    // applyOn === scopeEverything or not selected
    updateFormDefinition = form => {
      form = removeQueryFields(form);
      form = form.remove('application');
      form = form.remove('applicationIds');
      form = removeScopeByHostsField(form);

      return form;
    };
  }
  onChange('applyOn', applyOn, updateFormDefinition);
}

export function onBuiltInMetricChange(metricName, onChange, entityType) {
  return e => {
    if ((metricName && !e) || (e && e.value !== metricName)) {
      let selectedMetric = e ? e.value : '';
      onChange('metricName', selectedMetric, updatedForm => {
        if (isPercentile(updatedForm)) {
          updatedForm = updatedForm.remove('window').remove('aggregation');
          updatedForm = putRollupField(updatedForm);
        } else {
          updatedForm = updatedForm.remove('rollup');

          // Field can already be pre-filled with the "global" time-window form value
          // e.g. in case of setting the metric on any added, new condition
          if (!updatedForm.get('window')) {
            // In case when only one condition exists, and
            // we are switching from a Percentile metric
            // then it must be added
            updatedForm = putWindowField(updatedForm);
          }

          updatedForm = putAggregationField(updatedForm);
        }

        const buildInMetricsList = getAllBuiltInMetrics(entityType);
        const metricItem = find(buildInMetricsList, _metric => _metric.value === selectedMetric);
        if (metricItem) {
          if (isBuiltInPlainMetric(entityType, metricItem.value)) {
            updatedForm = updatedForm.remove('metricPatternOperator').remove('metricPatternPlaceholder');
          } else {
            updatedForm = updateMetricPatternForms(updatedForm, metricItem.defaultMatchingOperator);
          }

          const metricInfo = getBuiltInMetricInfo(metricItem);
          updatedForm = updatedForm
            .updateIn(['formatter'], f => f.setValue(metricInfo.formatter))
            .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
            .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));
        }

        return updatedForm;
      });
    }
  };
}

function updateMetricPatternForms(form, metricPlaceholderOperator, metricPlaceholderValue) {
  form = putMetricPatternOperator(form, metricPlaceholderOperator);
  if (metricPlaceholderOperator !== 'any') {
    return putMetricPatternPlaceholder(form, metricPlaceholderValue);
  }
  return form;
}

export function onCustomMetricChanged(metricName, onChange, customMetricsForPlugin) {
  return e => {
    if ((metricName && !e) || (e && e.value !== metricName)) {
      let selectedMetric = e ? e.value : '';
      onChange('metricName', selectedMetric, updatedForm => {
        updatedForm = updatedForm.remove('rollup');

        // Field can already be pre-filled with the "global" time-window form value
        // e.g. in case of setting the metric on any added, new condition
        if (!updatedForm.get('window')) {
          // it may only happen in theory
          // Cleaning it up can be postponed,
          // there is more things as aoon as no rollup metrics will be supported anymore
          updatedForm = putWindowField(updatedForm);
        }
        updatedForm = putAggregationField(updatedForm);

        const metricInfo = getCustomMetricInfo(customMetricsForPlugin, selectedMetric);

        updatedForm = updatedForm
          .updateIn(['formatter'], f => f.setValue(metricInfo.formatter))
          .updateIn(['conditionOperator'], f => f.setValue(null).setTouched(false))
          .updateIn(['conditionValue'], f => f.setValue('').setTouched(false));

        return updatedForm;
      });
    }
  };
}

function metricTypeOrBuiltinFormatterIfMissing(metricFormat, entityType, metricName) {
  // FIXME This logic fallback is only needed as long as not all plugins define a built-in metrics-catalog in the backend
  if (metricFormat === 'UNDEFINED') {
    const metricList = getAllBuiltInMetrics(entityType);
    const metricItem = find(metricList, _metric => _metric.value === metricName);

    if (metricItem) {
      return getFormatterType(metricItem.formatter);
    }
  }

  return metricFormat;
}
