/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import useTagCatalog from 'in-applications/hooks/useTagCatalog'; // TODO can this be moved outside of AP area, since it seems to be generic to be used in Website area as well
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { trackStartCreate } from 'in-alerting/smart-alerts/components/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { alertsTabListFullyQualified } from 'in-websites/navigation/paths';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useWebsiteError from 'in-websites/hooks/useWebsiteError';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { propTypeLocation } from 'in-stores/navigation';
import useWebsite from 'in-websites/hooks/useWebsite';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

const implicitTagFilters = ['beacon.website.id'];

export default function CreateSmartAlert({ location, websiteId, tagFilters, timeConfig }) {
  const errorId = getMatrixParameter(location, '/details', 'errorId');
  const customEventName = getMatrixParameter(location, '/details', 'customEventId');

  const alertType = deriveAlertType(errorId, customEventName);
  const blueprintConfig = getBlueprintConfig(alertType);
  const metricName = blueprintConfig.defaultMetric;
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);

  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  const [website, websiteStatus] = useWebsite(websiteId);

  const websiteError = useWebsiteError(websiteId, errorId, timeConfig);

  if (!tagCatalog || websiteStatus !== 'resolved') {
    return null;
  }

  const alertConfig = generateAlertConfig(
    websiteId,
    tagFilters,
    tagCatalog,
    blueprintConfig,
    websiteError?.data?.message,
    customEventName
  );

  return (
    <FloatingActionButton
      icon="lib_alerts_create"
      onClick={() => {
        addActiveDialog(
          <AlertConfigDialog
            onClose={() => {
              close();

              if (location.pathname.includes(alertsTabListFullyQualified)) {
                refreshSmartAlertConfigsList();
              }
            }}
            alertConfig={alertConfig}
            websiteLabel={website.label}
            startWithSimpleMode
          />
        );
        trackStartCreate();
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.addSmartAlert')}
    </FloatingActionButton>
  );
}

function deriveAlertType(errorId, customEventName) {
  if (isNotBlank(errorId)) {
    return 'specificJsError';
  }
  if (isNotBlank(customEventName)) {
    return 'customEvent';
  }
  return 'slowness';
}

CreateSmartAlert.propTypes = {
  location: propTypeLocation.isRequired,
  tagFilters: PropTypes.array.isRequired,
  websiteId: PropTypes.string.isRequired,
  timeConfig: propTypeTimeConfig
};

function generateAlertConfig(websiteId, tagFilters, tagCatalog, blueprintConfig, errorMessage, customEventName) {
  const tagFiltersWithoutImplicitFilters = tagFilters.filter(({ name }) => !implicitTagFilters.includes(name));
  const tagFilterFormModel = fromTagFiltersArray(tagFiltersWithoutImplicitFilters, tagCatalog);
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
    calculateThresholdOnBackend: true
  };
}
