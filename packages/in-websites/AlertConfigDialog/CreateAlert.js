import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SimpleAlertDialog from 'in-websites/AlertConfigDialog/simple/SimpleAlertDialog';
import ButtonRounded from 'in-new-components/ButtonRounded/ButtonRounded';
import { eumAlertingEnabled } from 'in-services/featureFlags';

import locals from './CreateAlert.mless';

export default function CreateAlert({ error, websiteId, websiteLabel, pageId, tagFilters, timeConfig }) {
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
          filterConfig={{ error, pageId, tagFilters, websiteId, websiteLabel, timeConfig }}
        />
      )}
    </>
  );
}

CreateAlert.propTypes = {
  error: PropTypes.object.isRequired,
  pageId: PropTypes.string,
  tagFilters: PropTypes.array,
  websiteId: PropTypes.string,
  websiteLabel: PropTypes.string,
  timeConfig: PropTypes.object
};
