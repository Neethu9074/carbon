import PropTypes from 'prop-types';
import React from 'react';

import { goToAlertConfig } from 'in-applications/navigation/paths';
import Button from 'in-new-components/Button';

import locals from './ApplicationAlertConfigButton.mless';

export default function ApplicationAlertConfigButton({ alertConfig }) {
  return (
    <Button
      className={locals.button}
      kind="secondary"
      onClick={() => {
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
