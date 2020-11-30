import PropTypes from 'prop-types';
import React from 'react';

import { applicationsAlertingEventDetailsViewEditConfig } from 'in-applications/alerting/tracker';
import { goToAlertConfig } from 'in-applications/navigation/paths';
import Button from 'in-new-components/Button';

export default function ApplicationAlertConfigButton({ alertConfig }) {
  return (
    <Button
      kind="secondary"
      onClick={() => {
        applicationsAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
        goToAlertConfig(alertConfig.id, alertConfig.created, alertConfig.applicationId);
      }}
    >
      View Alerting Configuration
    </Button>
  );
}

ApplicationAlertConfigButton.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
