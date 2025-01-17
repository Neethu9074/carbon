/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SlownessWebsiteAlertRule, TagCatalog, TagFilter, TimeConfig } from '@instana/types';
import { Button } from '@instana/components';

import useTagCatalog from 'in-applications/hooks/useTagCatalog'; // TODO can this be moved outside of AP area, since it seems to be generic to be used in Website area as well
import { websitesSmartAlertFullScreenDesignEnabled, smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { BluePrint, getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { getDefaultRules } from 'in-alerting/smart-alerts/eum/utils/eumCommon';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { alertsTabListFullyQualified } from 'in-websites/navigation/paths';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useWebsiteError from 'in-websites/hooks/useWebsiteError';
import useWebsite from 'in-websites/hooks/useWebsite';
import { Location } from 'in-stores/navigation/types';
import { isNotBlank } from 'in-services/util/string';
import { Website } from 'in-types';
import { t } from 'in-i18n';

const implicitTagFilters = ['beacon.website.id'];

const labelNew = t('in-alerting:smartAlerts.labelNew');

interface CreateSmartAlertProps {
  location: Location;
  websiteId: string;
  tagFilters: TagFilter[];
  timeConfig: TimeConfig;
}

export default function CreateSmartAlert({ location, websiteId, tagFilters, timeConfig }: CreateSmartAlertProps) {
  const errorId = getMatrixParameter(location, '/details', 'errorId');
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = deriveAlertType(errorId, customEventName);
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  const [website, websiteStatus] = useWebsite(websiteId);

  const websiteError = useWebsiteError(websiteId, errorId as string, timeConfig);
  const { trackCta } = useSegmentTracking();

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
    trackCta(ALERTING_CREATE);
  };

  const getLinkToCreateSmartAlert = ''; // TODO add new tearsheet link

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
            getLinkToCreateSmartAlert=""
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
              handleButtonClick(website);
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

  if (websitesSmartAlertFullScreenDesignEnabled && smartAlertCarbonTableEnabled) {
    return renderFullScreenDialog();
  }

  if (websitesSmartAlertFullScreenDesignEnabled) {
    return renderFloatingMenu();
  }

  return renderFloatingButton();
}

function deriveAlertType(errorId?: string | null, customEventName?: string | null) {
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

function generateAlertConfig(
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
