import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SimpleAlertDialog from 'in-websites/AlertConfigDialog/simple/SimpleAlertDialog';
import ButtonRounded from 'in-new-components/ButtonRounded/ButtonRounded';
import { eumAlertingEnabled } from 'in-services/featureFlags';

import locals from './CreateAlert.mless';

const implicitTagFilters = ['beacon.website.id'];

export default function CreateAlert({ error, tagFilters, websiteLabel, websiteId }) {
  if (!eumAlertingEnabled) {
    return null;
  }

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className={locals.button}>
        <ButtonRounded iconType="lib_alerts_create" onClick={() => setDialogOpen(true)} withBoxShadow>
          Create Alert
        </ButtonRounded>
      </div>
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
  error: PropTypes.object.isRequired,
  tagFilters: PropTypes.array,
  websiteLabel: PropTypes.string,
  timeConfig: PropTypes.object
};

function generateFormData(error, tagFilters, websiteId) {
  return {
    tagFilters: tagFilters.filter(({ name }) => !implicitTagFilters.includes(name)),
    rule: {
      alertType: 'specificJsError',
      operator: 'CONTAINS',
      value: error.message
    },
    threshold: {
      type: 'staticThreshold',
      value: 0.0
    },
    websiteId
  };
}
