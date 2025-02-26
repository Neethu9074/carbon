/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { SlownessWebsiteAlertRule, TagCatalog, TagFilter } from '@instana/types';

import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { BluePrint } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { getDefaultRules } from 'in-alerting/smart-alerts/eum/utils/eumCommon';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const implicitTagFilters = ['beacon.website.id'];

export function getHeaderTitle(editMode: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.websites.tearSheet.editTitle');
  }
  return t('in-alerting:smartAlerts.websites.tearSheet.createTitle');
}

export function duplicateAlertConfig(
  config: WebsiteSmartAlertConfigWithMetadata
): WebsiteSmartAlertConfigWithMetadata & { duplicateFrom?: string } {
  return {
    ...config,
    duplicateFrom: config.id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
}

export function deriveAlertType(errorId?: string, customEventName?: string) {
  if (isNotBlank(errorId)) {
    return 'specificJsError';
  }
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'slowness';
}

const defaultAlertRule: SlownessWebsiteAlertRule = {
  alertType: 'slowness',
  aggregation: 'P90',
  metricName: 'latency'
};

export function generateAlertConfig(
  websiteId: string,
  tagFilters: TagFilter[],
  blueprintConfig: BluePrint,
  tagCatalog?: TagCatalog,
  errorMessage?: string,
  customEventName?: string | null
) {
  const tagFiltersWithoutImplicitFilters = tagFilters.filter(({ name }) => !implicitTagFilters.includes(name));
  const tagFilterFormModel = fromTagFiltersArray(tagFiltersWithoutImplicitFilters, tagCatalog as TagCatalog);
  const alertType = blueprintConfig.type;
  const metricName = blueprintConfig.defaultMetric;
  const useBaseline = blueprintConfig.baselineEnabled;

  return {
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel),
    rule: {
      alertType,
      operator: EQUALS,
      value: errorMessage,
      customEventName,
      metricName
    },
    threshold: {
      type: useBaseline ? HISTORIC_BASELINE : STATIC_THRESHOLD,
      seasonality: useBaseline ? DAILY : undefined,
      value: 0.0
    },
    websiteId,
    calculateThresholdOnBackend: true,
    rules: getDefaultRules(useBaseline, defaultAlertRule)
  };
}

export function getButtonLabel(editMode?: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}
