/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagCatalog, TagFilter } from '@instana/types';

import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { STARTS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { Location } from 'in-stores/navigation/types';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface CreateSmartAlertProps {
  location: Location;
  mobileAppId: string;
  tagFilters: TagFilter[];
}

const implicitTagFilters = ['mobileBeacon.mobileApp.id'];

export default function CreateSmartAlert({ location, mobileAppId, tagFilters }: CreateSmartAlertProps) {
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = deriveAlertType(customEventName);

  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);

  const alertConfig = generateAlertConfig(mobileAppId, tagFilters, tagCatalog, blueprintConfig, customEventName);
  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <AlertConfigDialog
            onClose={() => {
              close();
            }}
            //@ts-expect-error Type error since HistoricBaselineConfig | AdaptiveBaselineConfig is  not available
            alertConfig={alertConfig}
            startWithSimpleMode
          />
        );
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}

function generateAlertConfig(
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

  return {
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel),
    rule: {
      alertType,
      operator: STARTS_WITH,
      value: '4',
      customEventName,
      metricName
    },
    threshold: {
      type: STATIC_THRESHOLD,
      seasonality: null,
      value: 0.0
    },
    mobileAppId
  };
}

function deriveAlertType(customEventName: string | null | undefined) {
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'statusCode';
}
