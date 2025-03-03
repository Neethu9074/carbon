/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TagCatalog, TagFilter } from '@instana/types';
import { Button } from '@instana/components';

import { mobileAppSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { getDefaultRules } from 'in-alerting/smart-alerts/eum/utils/eumCommon';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { alertsTabListFullyQualified } from 'in-mobile-apps/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { STARTS_WITH } from 'in-components/QueryBuilder/tagFilter/operators';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
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
  isListingPage: boolean;
}

const labelNew = t('in-alerting:smartAlerts.labelNew');

const implicitTagFilters = ['mobileBeacon.mobileApp.id'];

export default function CreateSmartAlert({ location, mobileAppId, tagFilters, isListingPage }: CreateSmartAlertProps) {
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = deriveAlertType(customEventName);

  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const getLinkToCreateSmartAlert = ''; // TODO add new tearsheet link

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  const { trackCta } = useSegmentTracking();

  const alertConfig = generateAlertConfig(mobileAppId, tagFilters, tagCatalog, blueprintConfig, customEventName);

  const handleButtonClick = () => {
    addDialog();
    trackCta(ALERTING_CREATE);
  };

  const addDialog = () => {
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
  };

  const renderFullScreenDialog = () => (
    <Button
      kind="primaryv2"
      icon="lib_openclose_add"
      onClick={() =>
        addActiveDialog(
          <ViewSelectorDialog trackCta={trackCta} openOldDialog={() => addDialog()} getLinkToCreateSmartAlert="" />
        )
      }
      size="xl"
    >
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );

  const renderFloatingMenu = () => (
    <>
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          <Button
            icon="lib_alerts_create"
            onClick={() => {
              trackCta(ALERTING_CREATE);
              handleButtonClick();
            }}
          >
            {t('in-alerting:smartAlerts.addSmartAlert')}
          </Button>
          <Button
            icon="lib_alerts_create"
            onClick={() => {
              trackCta(ALERTING_CREATE);
            }}
            href={getLinkToCreateSmartAlert}
          >
            {`${t('in-alerting:smartAlerts.addSmartAlert')} ${labelNew}`}
          </Button>
        </FloatingActionButtonMenu>
      </FloatingActionButtons>
    </>
  );

  const renderDialogButton = () => (
    <Button kind="primaryv2" icon="lib_openclose_add" size="xl" onClick={() => handleButtonClick()}>
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );

  const renderFloatingButton = () => (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        trackCta(ALERTING_CREATE);
        handleButtonClick();
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );

  if (mobileAppSmartAlertFullScreenDesignEnabled && smartAlertCarbonTableEnabled && isListingPage) {
    return renderFullScreenDialog();
  }

  if (isListingPage) {
    return renderDialogButton();
  }

  if (mobileAppSmartAlertFullScreenDesignEnabled) {
    return renderFloatingMenu();
  }

  return renderFloatingButton();
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

function deriveAlertType(customEventName: string | null | undefined) {
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'statusCode';
}
