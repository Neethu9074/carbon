/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TagCatalog, TagFilter } from '@instana/types';
import { Button } from '@instana/components';

import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { alertsTabListFullyQualified } from 'in-mobile-apps/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { STARTS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { Location } from 'in-stores/navigation/types';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

interface CreateSmartAlertProps {
  location: Location;
  mobileAppId: string;
  tagFilters: TagFilter[];
  isCarbonTableView?: boolean;
}

const implicitTagFilters = ['mobileBeacon.mobileApp.id'];

export default function CreateSmartAlert({
  location,
  mobileAppId,
  tagFilters,
  isCarbonTableView = false
}: CreateSmartAlertProps) {
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = deriveAlertType(customEventName);

  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  const { trackCta } = useSegmentTracking();

  const alertConfig = generateAlertConfig(mobileAppId, tagFilters, tagCatalog, blueprintConfig, customEventName);
  const handleButtonClick = () => {
    addDialog();
    trackCta(ALERTING_CREATE);
  };

  return (
    <>
      {!isCarbonTableView ? (
        <FloatingActionButton icon="lib_alerts_create" onClick={() => handleButtonClick()} withBoxShadow>
          {t('in-alerting:smartAlerts.addSmartAlert')}
        </FloatingActionButton>
      ) : (
        <Button kind="primaryv2" icon="lib_openclose_add" size="xl" onClick={() => handleButtonClick()}>
          {t('in-alerting:smartAlerts.createSmartAlert')}
        </Button>
      )}
    </>
  );

  function addDialog() {
    return addActiveDialog(
      <AlertConfigDialog
        onClose={() => {
          close();

          if (location.pathname.includes(alertsTabListFullyQualified)) {
            refreshSmartAlertConfigsList();
          }
        }}
        //@ts-expect-error Type error since HistoricBaselineConfig | AdaptiveBaselineConfig is  not available
        alertConfig={alertConfig}
        startWithSimpleMode
      />
    );
  }
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
  const useBaseline = blueprintConfig.baselineEnabled;

  return {
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel),
    rule: {
      alertType,
      operator: STARTS_WITH,
      value: '5',
      customEventName,
      metricName
    },
    threshold: {
      type: useBaseline ? HISTORIC_BASELINE : STATIC_THRESHOLD,
      seasonality: useBaseline ? DAILY : undefined,
      value: 0.0
    },
    mobileAppId,
    calculateThresholdOnBackend: true
  };
}

function deriveAlertType(customEventName: string | null | undefined) {
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'statusCode';
}
