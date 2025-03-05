/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Button } from '@instana/components';
import { TagFilter } from '@instana/types';

import { mobileAppSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/mobileApp/hooks/useSmartAlertCreateUrl';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { generateAlertConfig } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { alertsTabListFullyQualified } from 'in-mobile-apps/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
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

export default function CreateSmartAlert({ location, mobileAppId, tagFilters, isListingPage }: CreateSmartAlertProps) {
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = deriveAlertType(customEventName);

  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    mobileAppId,
    customEventName,
    tagFilters
  });

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
          <ViewSelectorDialog
            trackCta={trackCta}
            openOldDialog={() => addDialog()}
            getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
          />
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

export function deriveAlertType(customEventName: string | null | undefined) {
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'statusCode';
}
