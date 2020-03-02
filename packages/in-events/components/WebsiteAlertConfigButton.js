import PropTypes from 'prop-types';
import React from 'react';

import { websitesAlertingEventDetailsViewEditConfig } from 'in-websites/eum-alerting/tracker';
import { goToAlertConfig } from 'in-websites/navigation/paths';
import Button from 'in-new-components/Button';

import locals from './WebsiteAlertConfigButton.mless';

export default function WebsiteAlertConfigButton({ alertConfig }) {
  return (
    <Button
      className={locals.button}
      kind="secondary"
      onClick={() => {
        websitesAlertingEventDetailsViewEditConfig(alertConfig.id);
        goToAlertConfig(alertConfig.id, alertConfig.created, alertConfig.websiteId);
      }}
    >
      View/Edit Alerting Configuration
    </Button>
  );
}

WebsiteAlertConfigButton.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
