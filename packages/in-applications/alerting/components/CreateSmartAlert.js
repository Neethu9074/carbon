import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SmartAlertConfigDialogWrapper from 'in-applications/alerting/Dialog/SmartAlertConfigDialogWrapper';
import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
import { applicationsAlertingAddAlert } from 'in-applications/alerting/tracker';
import { propTypeLocation } from 'in-stores/navigation/navigation';
import { reload } from 'in-settings/components/List';

export default function CreateSmartAlert({ applicationLabel, applicationId, serviceId, endpointId, location }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <FloatingActionButton
        iconType="lib_alerts_create"
        onClick={() => {
          setDialogOpen(true);
          applicationsAlertingAddAlert(location.pathname, applicationLabel);
          if (location.pathname.includes('/application/alerts')) {
            reload();
          }
        }}
        withBoxShadow
      >
        Add Alert
      </FloatingActionButton>
      {dialogOpen && (
        <SmartAlertConfigDialogWrapper
          formData={{
            applicationId,
            tagFilters: [
              {
                name: 'service.id',
                operator: 'EQUALS',
                stringValue: serviceId
              },
              {
                name: 'endpoint.id',
                operator: 'EQUALS',
                stringValue: endpointId
              }
            ].filter(({ stringValue }) => Boolean(stringValue)),
            calculateThresholdOnBackend: true
          }}
          onClose={() => setDialogOpen(false)}
          editMode
        />
      )}
    </>
  );
}

CreateSmartAlert.propTypes = {
  applicationId: PropTypes.string.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  endpointId: PropTypes.string,
  location: propTypeLocation.isRequired,
  serviceId: PropTypes.string
};
