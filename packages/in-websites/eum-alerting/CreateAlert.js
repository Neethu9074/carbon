import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import FloatingActionButton, { positions } from 'in-new-components/FloatingActionButton/FloatingActionButton';
import SimpleAlertDialog from 'in-websites/eum-alerting/simple/SimpleAlertDialog';
import getWebsiteError from 'in-websites/subscriptions/getWebsiteError';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { eumAlertingEnabled } from 'in-services/featureFlags';
import { alwaysNull } from 'in-services/fixedStreams';
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
  if (!eumAlertingEnabled) {
    return null;
  }

  if (location.pathname.includes('/websiteMonitoring/website/configuration')) {
    return null;
  }

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
        onClick={() => setDialogOpen(true)}
        position={positions.bottomRight}
        withBoxShadow
      >
        Create Alert
      </FloatingActionButton>
      {dialogOpen && (
        <SimpleAlertDialog
          onClose={() => setDialogOpen(false)}
          formData={generateFormData(error, tagFilters, websiteId)}
          websiteLabel={websiteLabel}
        />
      )}
    </>
  );
}

CreateAlert.propTypes = {
  error: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  tagFilters: PropTypes.array.isRequired,
  websiteId: PropTypes.string.isRequired,
  websiteLabel: PropTypes.string,
  websiteResult$: PropTypes.object
};

function generateFormData(error, tagFilters, websiteId) {
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
    websiteId
  };
}
