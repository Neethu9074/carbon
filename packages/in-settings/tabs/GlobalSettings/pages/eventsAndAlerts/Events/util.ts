/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { EventSpecificationInfo, EventSpecificationType, AlertingAggregation } from 'in-types';
import { deprecateAppDataLegacyEventsEnabled } from 'in-services/featureFlags';
import { customIssuesDisabledForPlugins, plugins } from 'in-forge/constants';
import { isAppDataPlugin } from 'in-forge/plugins/pluginTypes';
import { FormatterType } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import { getPluginName } from 'in-sdk/pluginName';
import { Option } from 'in-components/ComboBox';
import { hasCategory } from 'in-sdk/metrics';
import { t } from 'in-i18n';

// event specification type enum names that the back end uses
export const builtInEnumValue: EventSpecificationType = 'BUILT_IN';
export const customEnumValue: EventSpecificationType = 'CUSTOM';

export const builtInValue = 'built-in';
export const customValue = 'custom';

export const deprecatedValue = 'deprecated';
export const migratedValue = 'migrated';

export const MAX_CHAR_LENGTH_ENTITY_LABEL = 2048;

export function isBuiltInRule(entity: EventSpecificationInfo): boolean {
  return isBuiltInRuleType(entity.type);
}

export function isBuiltInRuleType(type: string): boolean {
  return type === builtInEnumValue || type === builtInValue;
}

export function getSeverityText(severity: number): string {
  switch (severity) {
    case 10:
      return t('in-settings:tabs.critical');
    case 5:
      return t('in-settings:tabs.warning');
    default:
      return t('in-settings:tabs.none');
  }
}

export function getEntityTypeOptionsOfBuiltInMetrics(showDeprecatedLabel: boolean): Option[] {
  return Object.values(plugins)
    .filter(plugin => hasCategory(plugin))
    .filter(plugin => customIssuesDisabledForPlugins.indexOf(plugin) < 0)
    .sort((a, b) => compareIgnoreCase(getPluginName(a, 1)!, getPluginName(b, 1)!))
    .map(plugin => {
      return {
        value: plugin,
        label: getLabelForPlugin(plugin, showDeprecatedLabel)
      };
    });
}

function getLabelForPlugin(plugin: string, showDeprecatedLabel: boolean): string {
  return showDeprecatedLabel && shouldDisplayDeprecatedLabel(plugin)
    ? getPluginName(plugin, 1) + ` (${t('in-settings:tabs.deprecated')})`
    : getPluginName(plugin, 1)!;
}

function shouldDisplayDeprecatedLabel(plugin: string): boolean {
  return deprecateAppDataLegacyEventsEnabled && isDeprecatedAppDataEntityType(plugin);
}

export function formatterTypeToValueLabel(formatterType: FormatterType, metricName: string) {
  switch (formatterType) {
    case 'NANOS':
      return t('in-settings:tabs.nanoseconds');
    case 'MICROS':
      return t('in-settings:tabs.microseconds');
    case 'LATENCY':
    case 'MILLIS':
      return t('in-settings:tabs.milliseconds');
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
      if (metricName.toLowerCase().includes('status')) {
        // Unfortunately, there is no separate formatter type for status values, which also use the same NUMBER format.
        // However, using a label of "Count" for  its value would be incorrect or misleading here. Therefore, we derive the
        // information of whether it might be a status metric out of the metric name as a heuristic, to improve this for now.
        return t('in-settings:tabs.statusValue');
      }
      return t('in-settings:tabs.count');
    case 'UNDEFINED':
      return t('in-settings:tabs.value');
    default:
      return t('in-settings:tabs.value');
  }
}

export function mapConditionValue(
  value: number,
  formatterType: FormatterType,
  aggregation: AlertingAggregation
): number {
  if (isValueInPercentageScale(formatterType, aggregation)) {
    // we use a scale of [0, 100.0], but we only store the value in range [0, 1.0]
    value = formatNumber(value, getNumberOfDigits(value));
  }
  return value;
}

export function unmapConditionValue(
  value: number,
  formatterType: FormatterType,
  aggregation: AlertingAggregation
): number {
  if (isValueInPercentageScale(formatterType, aggregation)) {
    // we only store the value in range [0, 1.0], but we use a scale of [0, 100.0]
    value = round(value / 100, getNumberOfDigits(value) + 2);
  }
  return value;
}

function isValueInPercentageScale(formatterType: FormatterType, aggregation: AlertingAggregation) {
  return formatterType === 'PERCENTAGE' || aggregation === 'relative_diff';
}

/**
 * Checking case-insensitively, if the given entityType is one of the AppData plugins.
 */
export function isDeprecatedAppDataEntityType(entityType: string): boolean {
  if (entityType) {
    return isAppDataPlugin(entityType.toLowerCase());
  }
  return false;
}

function formatNumber(value: number, decimalPrecision: number): number {
  return round(value * 100, decimalPrecision);
}

function round(value: string | number, decimals: number): number {
  return parseFloat(Number.parseFloat(`${value}`).toFixed(decimals));
}

function getNumberOfDigits(value: string | number): number {
  const [, digits] = value?.toString()?.split('.') ?? [];
  return digits?.length || 0;
}

export function needsMigrationAction(entity: EventSpecificationInfo): boolean {
  return (
    deprecateAppDataLegacyEventsEnabled &&
    !isBuiltInRule(entity) &&
    isDeprecatedAppDataEntityType(entity.entityType) &&
    !entity.migrated
  );
}
