/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { plugins, customIssuesDisabledForPlugins } from 'in-forge/constants';
import { compareIgnoreCase } from 'in-services/util/string';
import { getPluginName } from 'in-sdk/pluginName';
import { hasCategory } from 'in-sdk/metrics';
import { t } from 'in-i18n';

// event specification type enum names that the back end uses
export const builtInEnumValue = 'BUILT_IN';
export const customEnumValue = 'CUSTOM';

export const builtInValue = 'built-in';
export const customValue = 'custom';

export function isBuiltInRule(entity) {
  return isBuiltInRuleType(entity.type);
}

export function isBuiltInRuleType(type) {
  return type === builtInEnumValue || type == builtInValue;
}

export function isTriggering(entity) {
  if (isBuiltInRule(entity)) {
    return entity.triggering;
  } else if (entity.event) {
    return entity.event.triggering;
  }
  return false;
}

export function getSeverityText(severity) {
  switch (severity) {
    case 10:
      return t('in-settings:tabs.critical');
    case 5:
      return t('in-settings:tabs.warning');
    default:
      return t('in-settings:tabs.none');
  }
}

export function getSeverity(entity) {
  if (isBuiltInRule(entity)) {
    return entity.severity;
  } else if (entity.event) {
    return entity.event.severity;
  }
  return 0;
}

export function getDescription(entity) {
  if (isBuiltInRule(entity)) {
    return entity.description;
  } else if (entity.event) {
    return entity.event.description;
  }
  return null;
}

export function getEntityTypeOptions() {
  return Object.keys(plugins)
    .map(k => plugins[k])
    .filter(plugin => hasCategory(plugin))
    .filter(plugin => customIssuesDisabledForPlugins.indexOf(plugin) < 0)
    .sort((a, b) => compareIgnoreCase(getPluginName(a, 1), getPluginName(b, 1)))
    .map(plugin => {
      return {
        value: plugin,
        label: getPluginName(plugin, 1)
      };
    });
}

export function formatterTypeToDefinition(formatterType) {
  switch (formatterType) {
    case 'LATENCY':
    case 'MILLIS':
      return t('in-settings:tabs.milliseconds');
    case 'MICROS':
      return t('in-settings:tabs.microseconds');
    case 'SECONDS':
      return t('in-settings:tabs.seconds');
    case 'MINUTES':
      return t('in-settings:tabs.minutes');
    case 'PERCENTAGE':
      return t('in-settings:tabs.percentage');
    case 'RATE':
      return t('in-settings:tabs.ratePerSecond');
    case 'BYTE_RATE':
      return t('in-settings:tabs.bytesPerSecond');
    case 'KILO_BYTE_RATE':
      return t('in-settings:tabs.kilobytesPerSecond');
    case 'BYTES':
      return t('in-settings:tabs.bytes');
    case 'KILO_BYTES':
      return t('in-settings:tabs.kilobytes');
    case 'NUMBER':
      return t('in-settings:tabs.count');
    case 'UNDEFINED':
      return t('in-settings:tabs.value');
    default:
      return t('in-settings:tabs.value');
  }
}

export function mapConditionValue(value, formatterType) {
  if (formatterType === 'PERCENTAGE') {
    // we use a scale of [0, 100.0], but we only store the value in range [0, 1.0]
    value *= 100;
  } else if (formatterType === 'MICROS') {
    // convert to millis
    value /= 1000;
  }
  return value;
}

export function unmapConditionValue(value, formatterType) {
  if (formatterType === 'PERCENTAGE') {
    value /= 100;
  } else if (formatterType === 'MICROS') {
    value *= 1000;
  }
  return value;
}
