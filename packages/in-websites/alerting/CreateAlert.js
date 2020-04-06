import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
import { websitesAlertingAddAlert } from 'in-websites/alerting/tracker';
import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import AlertConfigDialog from 'in-websites/alerting/AlertConfigDialog';
import { propTypeLocation } from 'in-stores/navigation/navigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
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
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!error && websiteErrorResult) {
    error = get(websiteErrorResult, ['data']);
  }

  if (!websiteLabel && websiteResult) {
    websiteLabel = get(websiteResult, ['data', 'label']);
  }

  return (
    <>
      <FloatingActionButton
        iconType="lib_alerts_create"
        onClick={() => {
          setDialogOpen(true);
          websitesAlertingAddAlert(location.pathname, websiteLabel);
        }}
        withBoxShadow
      >
        Add Alert
      </FloatingActionButton>
      {dialogOpen && (
        <AlertConfigDialog
          onClose={() => {
            setDialogOpen(false);
            if (location.pathname.includes('/websiteMonitoring/website/alerts')) {
              reload();
            }
          }}
          formData={generateFormData(websiteId, tagFilters, error)}
          websiteLabel={websiteLabel}
        />
      )}
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

function generateFormData(websiteId, tagFilters, error) {
  return {
    tagFilters: tagFilters.filter(({ name }) => !implicitTagFilters.includes(name)),
    rule: {
      alertType: 'specificJsError',
      operator: 'EQUALS',
      value: error ? error.message : ''
    },
    threshold: {
      type: 'staticThreshold',
      value: 0.0
    },
    websiteId,
    calculateThresholdOnBackend: Boolean(error)
  };
}
