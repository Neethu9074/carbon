/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TagFilter, TimeConfig } from '@instana/types';
import { Button } from '@instana/components';

import useTagCatalog from 'in-applications/hooks/useTagCatalog'; // TODO can this be moved outside of AP area, since it seems to be generic to be used in Website area as well
import { websitesSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { deriveAlertType, generateAlertConfig } from 'in-alerting/smart-alerts/websites/TearSheet/sharedFunctions';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/websites/hooks/useSmartAlertCreateUrl';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import { alertsTabListFullyQualified, detailsPath } from 'in-websites/navigation/paths';
import { customEventId, errorId as errorIdMatrix } from 'in-websites/navigation/matrix';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { FULLSCREEN, SIMPLE } from 'in-alerting/smart-alerts/data/constants';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useWebsiteError from 'in-websites/hooks/useWebsiteError';
import useWebsite from 'in-websites/hooks/useWebsite';
import { Location } from 'in-stores/navigation/types';
import { Website } from 'in-types';
import { t } from 'in-i18n';

const labelNew = t('in-alerting:smartAlerts.labelNew');

interface CreateSmartAlertProps {
  location: Location;
  websiteId: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
  isListingPage: boolean;
}

export default function CreateSmartAlert({
  location,
  websiteId,
  tagFilters,
  timeConfig,
  isListingPage
}: CreateSmartAlertProps) {
  const errorId = getMatrixParameter(location, detailsPath, errorIdMatrix) ?? undefined;
  const customEventName = getMatrixParameter(location, detailsPath, customEventId) ?? undefined;

  const alertType = deriveAlertType(errorId, customEventName);
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  const [website, websiteStatus] = useWebsite(websiteId);

  const websiteError = useWebsiteError(websiteId, errorId as string, timeConfig);
  const { trackCta } = useSegmentTracking();

  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    websiteId,
    errorMessage: websiteError?.data?.message,
    customEventName,
    errorId,
    tagFilters
  });

  if (!tagCatalog || websiteStatus !== 'resolved') {
    return null;
  }

  const alertConfig = generateAlertConfig(
    websiteId,
    tagFilters,
    blueprintConfig,
    tagCatalog,
    websiteError?.data?.message,
    customEventName
  );

  const handleButtonClick = (website: Website) => {
    addDialog(website);
    trackCta(ALERTING_CREATE, { dialogMode: SIMPLE });
  };

  const addDialog = (website: Website) => {
    return addActiveDialog(
      <AlertConfigDialog
        onClose={() => {
          close();

          if (location.pathname.includes(alertsTabListFullyQualified)) {
            refreshSmartAlertConfigsList();
          }
        }}
        //@ts-expect-error
        alertConfig={alertConfig}
        websiteLabel={website.label}
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
            openOldDialog={() => addDialog(website)}
            getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
            mode={SIMPLE}
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
              trackCta(ALERTING_CREATE, { dialogMode: SIMPLE });
              handleButtonClick(website);
            }}
          >
            {t('in-alerting:smartAlerts.addSmartAlert')}
          </Button>
          <Button
            icon="lib_alerts_create"
            onClick={() => {
              trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
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
    <Button kind="primaryv2" icon="lib_openclose_add" onClick={() => handleButtonClick(website)} size="xl">
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );

  const renderFloatingButton = () => (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        trackCta(ALERTING_CREATE);
        handleButtonClick(website);
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );

  if (websitesSmartAlertFullScreenDesignEnabled && smartAlertCarbonTableEnabled && isListingPage) {
    return renderFullScreenDialog();
  }

  if (isListingPage) {
    return renderDialogButton();
  }

  if (websitesSmartAlertFullScreenDesignEnabled) {
    return renderFloatingMenu();
  }

  return renderFloatingButton();
}
