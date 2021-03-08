/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { get } from 'lodash';
import React from 'react';

import useTagCatalog from 'in-applications/hooks/useTagCatalog'; // TODO can this be moved outside of AP area, since it seems to be generic to be used in Website area as well
import { getQueryBuilderForBeaconType } from 'in-alerting/smart-alerts/websites/alerting/components/AlertQueryBuilder';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/alerting/data/blueprintConfig';
import { fromTagFiltersArray } from 'in-new-components/QueryBuilder/transformation/formModel';
import { websitesAlertingAddAlert } from 'in-alerting/smart-alerts/websites/alerting/tracker';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/alerting/AlertConfigDialog';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-new-components/FloatingActionButton';
import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { propTypeLocation } from 'in-stores/navigation';
import { alwaysNull } from 'in-services/fixedStreams';
import { reload } from 'in-settings/components/List';
import connectTo from 'in-hoc/connectTo';

const implicitTagFilters = ['beacon.website.id'];

export default connectTo(props => {
  const observables = {};

  const errorId = getMatrixParameter(props.location, '/details', 'errorId');

  if (!props.error && errorId) {
    observables.websiteErrorResult = getWebsiteError({
      timeConfig: props.timeConfig,
      websiteId: props.websiteId,
      errorId
    });
  }

  observables.websiteResult = props.websiteResult$ ? props.websiteResult$ : alwaysNull;

  return observables;
})(CreateAlert);

function CreateAlert({ websiteErrorResult, websiteResult, location, websiteId, websiteLabel, tagFilters, error }) {
  if (!error && websiteErrorResult) {
    error = get(websiteErrorResult, ['data']);
  }

  if (!websiteLabel && websiteResult) {
    websiteLabel = get(websiteResult, ['data', 'label']);
  }

  const alertType = error?.message ? 'specificJsError' : 'slowness';
  const metricName = error?.message ? 'errors' : 'onLoadTime';
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);
  const boundedAlertQueryBuilder = getQueryBuilderForBeaconType(beaconType);
  const tagCatalog = useTagCatalog(boundedAlertQueryBuilder.getTagCatalog);
  if (!tagCatalog) {
    return null;
  }

  if (location.pathname.includes('/websiteMonitoring/website/configuration')) {
    return null;
  }

  return (
    <>
      <FloatingActionButton
        iconType="lib_alerts_create"
        onClick={() => {
          addActiveDialog(
            <AlertConfigDialog
              onClose={() => {
                close();
                if (location.pathname.includes('/websiteMonitoring/website/alerts')) {
                  reload();
                }
              }}
              formData={generateFormData(websiteId, tagFilters, error, tagCatalog)}
              websiteLabel={websiteLabel}
            />
          );

          websitesAlertingAddAlert(location.pathname, websiteLabel);
        }}
        withBoxShadow
      >
        Add Alert
      </FloatingActionButton>
    </>
  );
}

CreateAlert.propTypes = {
  error: PropTypes.object,
  location: propTypeLocation.isRequired,
  tagFilters: PropTypes.array.isRequired,
  websiteId: PropTypes.string.isRequired,
  websiteLabel: PropTypes.string,
  websiteResult: PropTypes.object,
  websiteErrorResult: PropTypes.object
};

function generateFormData(websiteId, tagFilters, error, tagCatalog) {
  const tagFiltersWithoutImplicitFilters = tagFilters.filter(({ name }) => !implicitTagFilters.includes(name));
  const tagFilterFormModel = fromTagFiltersArray(tagFiltersWithoutImplicitFilters, tagCatalog);
  const alertType = error?.message ? 'specificJsError' : 'slowness';
  const metricName = error?.message ? 'errors' : 'onLoadTime';

  return {
    tagFilters: tagFiltersWithoutImplicitFilters,
    tagFilterExpression: toBackendQueryModel(tagFilterFormModel),
    rule: {
      alertType,
      operator: 'EQUALS',
      value: error?.message ?? null,
      metricName
    },
    threshold: {
      type: error?.message ? 'staticThreshold' : 'historicBaseline',
      seasonality: error?.message ?? 'DAILY',
      value: 0.0
    },
    websiteId,
    calculateThresholdOnBackend: true
  };
}
