import PropTypes from 'prop-types';
import React from 'react';

import ApplicationSmartAlertConfigDialog from 'in-applications/alerting/Dialog/ApplicationSmartAlertConfigDialog';
import FloatingActionButton, { positions } from 'in-new-components/FloatingActionButton/FloatingActionButton';
import { applicationsAlertingAddAlert } from 'in-applications/alerting/tracker';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { propTypeLocation } from 'in-stores/navigation/navigation';
import { reload } from 'in-settings/components/List';

export default function CreateApplicationSmartAlert({
  applicationLabel,
  applicationId,
  serviceId,
  endpointId,
  location
}) {
  return (
    <>
      <FloatingActionButton
        iconType="lib_alerts_create"
        onClick={() => {
          setActiveDialog(
            <ApplicationSmartAlertConfigDialog
              formData={{
                name: applicationLabel,
                applicationId,
                tagFilters: [
                  {
                    name: 'serviceId',
                    operator: 'EQUALS',
                    stringValue: serviceId
                  },
                  {
                    name: 'endpointId',
                    operator: 'EQUALS',
                    stringValue: endpointId
                  }
                ].filter(({ stringValue }) => Boolean(stringValue))
              }}
              onClose={close}
              editMode
            />
          );

          applicationsAlertingAddAlert(location.pathname, applicationLabel);

          if (location.pathname.includes('/application/alerts')) {
            reload();
          }
        }}
        position={positions.bottomRight}
        withBoxShadow
      >
        Add Alert
      </FloatingActionButton>
    </>
  );
}

CreateApplicationSmartAlert.propTypes = {
  applicationId: PropTypes.string.isRequired,
  applicationLabel: PropTypes.string.isRequired,
  endpointId: PropTypes.string,
  location: propTypeLocation.isRequired,
  serviceId: PropTypes.string
};
