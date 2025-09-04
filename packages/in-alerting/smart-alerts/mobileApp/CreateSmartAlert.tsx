/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Button } from '@instana/components';
import { TagFilter } from '@instana/types';

import {
  mobileAppSmartAlertFullScreenDesignEnabled,
  mobileAppSmartAlertDialogViewEnabled
} from 'in-services/featureFlags';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/mobileApp/hooks/useSmartAlertCreateUrl';
import MobileAppEntitySection from 'in-alerting/smart-alerts/mobileApp/MobileAppEntitySection';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import { generateAlertConfig } from 'in-alerting/smart-alerts/mobileApp/data/sharedFunctions';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { FULLSCREEN, SIMPLE, CHOICE_DIALOG } from 'in-alerting/smart-alerts/data/constants';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { alertsTabListFullyQualified } from 'in-mobile-apps/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
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
  isEventsView?: boolean;
}

const alertDisplayMode = getSmartAlertDisplayMode(
  mobileAppSmartAlertDialogViewEnabled,
  mobileAppSmartAlertFullScreenDesignEnabled
);

export default function CreateSmartAlert({ location, mobileAppId, tagFilters, isEventsView }: CreateSmartAlertProps) {
  const [selectedMobileAppId, setSelectedMobileAppId] = useState(mobileAppId);
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = useMemo(() => deriveAlertType(customEventName), [customEventName]);
  const { goToPath } = useNavigation();
  const blueprintConfig = useMemo(() => getBlueprintConfig(alertType), [alertType]);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = useMemo(() => getQueryBuilderForBeaconType(beaconType), [beaconType]);

  useEffect(() => {
    if (selectedMobileAppId && selectedMobileAppId !== mobileAppId) {
      handleButtonClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMobileAppId]);

  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    mobileAppId: selectedMobileAppId,
    customEventName,
    tagFilters
  });

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  const { trackCta } = useSegmentTracking();

  const handleButtonClick = () => {
    if (alertDisplayMode === CHOICE_DIALOG) {
      addActiveDialog(
        <ViewSelectorDialog
          trackCta={trackCta}
          openOldDialog={() => openDialog()}
          getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
          mode={SIMPLE}
        />
      );
      return;
    }
    if (alertDisplayMode === FULLSCREEN) {
      trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
      goToPath(getLinkToCreateSmartAlert.slice(2));
      return;
    }
    trackCta(ALERTING_CREATE, { dialogMode: SIMPLE });
    openDialog();
  };

  const handleSelectedMobileApp = (id: string) => {
    setSelectedMobileAppId(id);
  };

  const handleMobileAppSelection = () => {
    setSelectedMobileAppId('');
    addActiveDialog(<MobileAppEntitySection handleSelectedMobileApp={handleSelectedMobileApp} />);
  };

  const openDialog = () => {
    const alertConfig = generateAlertConfig(
      selectedMobileAppId,
      tagFilters,
      tagCatalog,
      blueprintConfig,
      customEventName
    );
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

  return (
    <Button
      kind="primaryv2"
      icon="lib_openclose_add"
      onClick={isEventsView ? handleMobileAppSelection : handleButtonClick}
      size="xl"
    >
      {t('in-alerting:smartAlerts.createSmartAlert')}
    </Button>
  );
}

export function deriveAlertType(customEventName: string | null | undefined) {
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'statusCode';
}
