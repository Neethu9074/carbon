/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { plugins, customIssuesDisabledForPlugins } from 'in-forge/constants';
import { compareIgnoreCase } from 'in-services/util/string';
import { getPluginName } from 'in-sdk/pluginName';
import { hasCategory } from 'in-sdk/metrics';

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
      return 'Critical';
    case 5:
      return 'Warning';
    default:
      return 'None';
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
      return 'Milliseconds';
    case 'MICROS':
      return 'Microseconds';
    case 'SECONDS':
      return 'Seconds';
    case 'MINUTES':
      return 'Minutes';
    case 'PERCENTAGE':
      return 'Percentage';
    case 'RATE':
      return 'Rate per second';
    case 'BYTE_RATE':
      return 'Bytes per second';
    case 'KILO_BYTE_RATE':
      return 'Kilobytes per second';
    case 'BYTES':
      return 'Bytes';
    case 'KILO_BYTES':
      return 'Kilobytes';
    case 'NUMBER':
      return 'Count';
    case 'UNDEFINED':
      return 'Value';
    default:
      return 'Value';
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
