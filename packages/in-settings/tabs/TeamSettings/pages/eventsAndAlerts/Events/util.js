/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { deprecateAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
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

export const deprecatedValue = 'deprecated';
export const migratedValue = 'migrated';

export function isBuiltInRule(entity) {
  return isBuiltInRuleType(entity.type);
}

export function isBuiltInRuleType(type) {
  return type === builtInEnumValue || type === builtInValue;
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

/**
 * Gets entity type options for entities that have at least one built-in metric definition and is not listed as a disabled plugin.
 * Consequently, plugins that only have custom-metrics are also not returned by this method.
 * @return {{label: string|""|string, value: *}[]} Plugin options for built-in metrics in alphabetical order.
 */
export function getEntityTypeOptionsOfBuiltInMetrics(showDeprecatedLabel) {
  return Object.values(plugins)
    .filter(plugin => hasCategory(plugin))
    .filter(plugin => customIssuesDisabledForPlugins.indexOf(plugin) < 0)
    .sort((a, b) => compareIgnoreCase(getPluginName(a, 1), getPluginName(b, 1)))
    .map(plugin => {
      return {
        value: plugin,
        label: getLabelForPlugin(plugin, showDeprecatedLabel)
      };
    });
}

function getLabelForPlugin(plugin, showDeprecatedLabel) {
  return showDeprecatedLabel && shouldDisplayDeprecatedLabel(plugin)
    ? getPluginName(plugin, 1) + ` (${t('in-settings:tabs.deprecated')})`
    : getPluginName(plugin, 1);
}

function shouldDisplayDeprecatedLabel(plugin) {
  return deprecateAppDataLegacyEventsEnabled && isDeprecatedAppDataEntity(plugin);
}

function isDeprecatedAppDataEntity(plugin) {
  return plugin === 'application' || plugin === 'service' || plugin === 'endpoint';
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
    case 'BYTES':
      return t('in-settings:tabs.bytes');
    case 'KILO_BYTES':
      return t('in-settings:tabs.kilobytes');
    case 'MEGA_BYTES':
      return t('in-settings:tabs.megabytes');
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
    value = formatNumber(value, getNumberOfDigits(value));
  } else if (formatterType === 'MICROS') {
    // convert to millis
    value /= 1000;
  }
  return value;
}

export function unmapConditionValue(value, formatterType) {
  if (formatterType === 'PERCENTAGE') {
    value = round(value / 100, getNumberOfDigits(value) + 2);
  } else if (formatterType === 'MICROS') {
    value *= 1000;
  }
  return value;
}

const migrateableEntityTypes = ['application', 'service', 'endpoint'];
export function isAppDataEntityType(entityType = '') {
  return migrateableEntityTypes.includes(entityType.toLowerCase());
}

function formatNumber(value, decimalPrecision) {
  return round(value * 100, decimalPrecision);
}

function round(value, decimals) {
  return parseFloat(Number.parseFloat(`${value}`).toFixed(decimals));
}

function getNumberOfDigits(value) {
  const [, digits] = value?.toString()?.split('.') ?? [];
  return digits?.length || 0;
}

export function needsMigrationAction(entity) {
  return (
    deprecateAppDataLegacyEventsEnabled &&
    !isBuiltInRule(entity) &&
    isAppDataEntityType(entity.entityType) &&
    !entity.migrated
  );
}
