/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TagCatalog, TagFilter } from '@instana/types';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { BluePrint } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { getDefaultRules } from 'in-alerting/smart-alerts/eum/utils/eumCommon';
import { STARTS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import { t } from 'in-i18n';

const implicitTagFilters = ['mobileBeacon.mobileApp.id'];

export function generateAlertConfig(
  mobileAppId: string,
  tagFilters: TagFilter[],
  tagCatalog: TagCatalog | undefined,
  blueprintConfig: BluePrint,
  customEventName: string | null | undefined
) {
  const tagFiltersWithoutImplicitFilters = tagFilters.filter(
    ({ name }: { name: string }) => !implicitTagFilters.includes(name)
  );
  const tagFilterFormModel = tagCatalog
    ? fromTagFiltersArray(tagFiltersWithoutImplicitFilters, tagCatalog as TagCatalog)
    : [];
  const alertType = blueprintConfig.type;
  const metricName = blueprintConfig.defaultMetric;
  const useBaseline = blueprintConfig.baselineEnabled;

  const defaultRule = {
    alertType,
    operator: STARTS_WITH,
    value: '5',
    customEventName,
    metricName
  };

  return {
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel),
    rule: defaultRule,
    mobileAppId,
    rules: getDefaultRules(useBaseline, defaultRule),
    calculateThresholdOnBackend: true
  };
}

export function getButtonLabel(editMode?: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}

export function getHeaderTitle(editMode: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.mobileApp.tearSheet.editTitle');
  }
  return t('in-alerting:smartAlerts.mobileApp.tearSheet.createTitle');
}
