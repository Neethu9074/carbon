/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  dataSourceBuiltIn,
  dataSourceCustom,
  dataSourceSystem
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { entityCountDetection } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { systemRuleEntityCountEnabled } from 'in-services/featureFlags';
import { Option, Options } from 'in-components/ComboBox';
import { millis } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const severityWarning = '5';
const severityCritical = '10';

export const severityOptions: ReadonlyArray<Option> = Object.freeze([
  { value: severityWarning, label: t('in-settings:tabs.warning') },
  { value: severityCritical, label: t('in-settings:tabs.critical') }
]);

export const dataSourceOptions: ReadonlyArray<Option> = Object.freeze([
  { value: dataSourceBuiltIn, label: t('in-settings:tabs.builtInMetrics') },
  { value: dataSourceCustom, label: t('in-settings:tabs.customMetrics') },
  { value: dataSourceSystem, label: t('in-settings:tabs.systemRules') }
]);

export type IdNamePair = { id: string; name: string };

export function systemRuleOptions(systemRules: ReadonlyArray<IdNamePair>): Options {
  if (!systemRules) {
    return [];
  }
  return systemRules
    .filter(({ id }) => systemRuleEntityCountEnabled || id != entityCountDetection.id)
    .map(({ id, name }) => ({ value: id, label: name }));
}

/**
 * Gets the given options but extends it with the selected value if it is missing.
 * This is needed for options where there has not always been a backend validation,
 * and therefore there could still be a some Custom Events using these values that
 * are not listed in possible options.
 * Therefore, we include this custom value in the dropdown, instead of selecting
 * nothing.
 */
export function getOptionsWithAdditionalValueIfMissing(
  options: ReadonlyArray<Option>,
  selectedTimeValue?: string
): ReadonlyArray<Option> {
  if (selectedTimeValue && selectedTimeValue !== '0') {
    const optionsContainTimeValue = options.some(opt => opt.value == selectedTimeValue);
    return optionsContainTimeValue
      ? options
      : [
          {
            value: selectedTimeValue,
            label: millis.fixedCompact(Number(selectedTimeValue))
          },
          ...options
        ];
  } else {
    return options;
  }
}

export const gracePeriodOptions: Options = Object.freeze([
  { value: '5000', label: t('in-settings:tabs.5S') },
  { value: '10000', label: t('in-settings:tabs.10S') },
  { value: '30000', label: t('in-settings:tabs.30S') },
  { value: '60000', label: t('in-settings:tabs.60S') },
  { value: '90000', label: t('in-settings:tabs.90S') },
  { value: '300000', label: t('in-settings:tabs.5Min') },
  { value: '600000', label: t('in-settings:tabs.10Min') },
  { value: '1800000', label: t('in-settings:tabs.30Min') },
  { value: '3600000', label: t('in-settings:tabs.60Min') },
  { value: '5400000', label: t('in-settings:tabs.90Min') },
  { value: '7200000', label: t('in-settings:tabs.120Min') },
  { value: '14400000', label: t('in-settings:tabs.4H') },
  { value: '21600000', label: t('in-settings:tabs.6H') },
  { value: '43200000', label: t('in-settings:tabs.12H') },
  { value: '86400000', label: t('in-settings:tabs.24H') }
]);

export const windowOptions: Options = Object.freeze([
  { value: '1000', label: t('in-settings:tabs.1S') },
  { value: '5000', label: t('in-settings:tabs.5S') },
  { value: '10000', label: t('in-settings:tabs.10S') },
  { value: '30000', label: t('in-settings:tabs.30S') },
  { value: '60000', label: t('in-settings:tabs.60S') },
  { value: '90000', label: t('in-settings:tabs.90S') },
  { value: '300000', label: t('in-settings:tabs.5Min') },
  { value: '600000', label: t('in-settings:tabs.10Min') },
  { value: '1800000', label: t('in-settings:tabs.30Min') },
  { value: '3600000', label: t('in-settings:tabs.60Min') },
  { value: '5400000', label: t('in-settings:tabs.90Min') },
  { value: '7200000', label: t('in-settings:tabs.120Min') }
]);

export const rollupOptions: Options = Object.freeze([
  { value: '5000', label: t('in-settings:tabs.5S') },
  { value: '60000', label: t('in-settings:tabs.1Min') },
  { value: '300000', label: t('in-settings:tabs.5Min') },
  { value: '3600000', label: t('in-settings:tabs.60Min') }
]);

export const aggregationOptions: Options = Object.freeze([
  { value: 'avg', label: t('in-settings:tabs.avg') },
  { value: 'sum', label: t('in-settings:tabs.sum') },
  { value: 'min', label: t('in-settings:tabs.min') },
  { value: 'max', label: t('in-settings:tabs.max') },
  { value: 'relative_diff', label: t('in-settings:tabs.relative_diff') },
  { value: 'absolute_diff', label: t('in-settings:tabs.absolute_diff') }
]);

export const conditionOperatorOptions: Options = Object.freeze([
  { value: '<', label: '<' },
  { value: '<=', label: '≤' },
  { value: '=', label: '=' },
  { value: '>=', label: '≥' },
  { value: '>', label: '>' },
  { value: '!=', label: '≠' }
]);

export const entityTypesToExcludeInVerificationRule: Readonly<string[]> = Object.freeze([
  'application',
  'awsEbs',
  'awsLambda',
  'awsLambdaVersion',
  'cassandraCluster',
  'cockroachDBCluster',
  'consulCluster',
  'couchbaseCluster',
  'elasticsearchCluster',
  'endpoint',
  'hazelcastCluster',
  'host',
  'instanaAgent',
  'kafkaCluster',
  'kubernetesCluster',
  'kubernetesDeployment',
  'kubernetesNamespace',
  'kubernetesNode',
  'kubernetesPod',
  'kubernetesReplicaSet',
  'mongoDbReplicaSet',
  'openshiftDeploymentConfig',
  'ping',
  'redisCluster',
  'service'
]);

export const entityLabelOperatorOptions: Options = Object.freeze([
  { value: 'is', label: t('in-settings:tabs.is') },
  { value: 'contains', label: t('in-settings:tabs.contains') },
  { value: 'startsWith', label: t('in-settings:tabs.startsWith') },
  { value: 'endsWith', label: t('in-settings:tabs.endsWith') }
]);

export const offlineDurationOptions: Options = Object.freeze([
  { value: '60000', label: t('in-settings:tabs.1Min') },
  { value: '120000', label: t('in-settings:tabs.2Min') },
  { value: '180000', label: t('in-settings:tabs.3Min') },
  { value: '300000', label: t('in-settings:tabs.5Min') },
  { value: '600000', label: t('in-settings:tabs.10Min') },
  { value: '1800000', label: t('in-settings:tabs.30Min') },
  { value: '3600000', label: t('in-settings:tabs.60Min') },
  { value: '5400000', label: t('in-settings:tabs.90Min') },
  { value: '7200000', label: t('in-settings:tabs.120Min') },
  { value: '14400000', label: t('in-settings:tabs.4H') },
  { value: '21600000', label: t('in-settings:tabs.6H') },
  { value: '43200000', label: t('in-settings:tabs.12H') },
  { value: '64800000', label: t('in-settings:tabs.18H') },
  { value: '86400000', label: t('in-settings:tabs.24H') }
]);

export const hostAvailabilityOfflineDurationOptions: Options = Object.freeze([
  { value: '60000', label: t('in-settings:tabs.1Min') },
  { value: '120000', label: t('in-settings:tabs.2Min') },
  { value: '180000', label: t('in-settings:tabs.3Min') },
  { value: '300000', label: t('in-settings:tabs.5Min') },
  { value: '600000', label: t('in-settings:tabs.10Min') },
  { value: '1800000', label: t('in-settings:tabs.30Min') },
  { value: '3600000', label: t('in-settings:tabs.60Min') }
]);

export const automaticallyCloseAfterOptions: Options = Object.freeze([...offlineDurationOptions]);

export const metricPatternMatchingOptions: Options = Object.freeze([
  { value: 'is', label: t('in-settings:tabs.is') },
  { value: 'contains', label: t('in-settings:tabs.contains') },
  { value: 'startsWith', label: t('in-settings:tabs.startsWith') },
  { value: 'endsWith', label: t('in-settings:tabs.endsWith') },
  { value: 'any', label: t('in-settings:tabs.any') }
]);

export const infraTagTreeNode = {
  label: 'tag',
  name: 'tag',
  path: [
    {
      label: t('in-settings:tabs.hostsByTag.host'),
      type: 'LEVEL'
    },
    {
      label: t('in-settings:tabs.hostsByTag.tag'),
      type: 'TAG'
    }
  ],
  type: 'STRING'
};
