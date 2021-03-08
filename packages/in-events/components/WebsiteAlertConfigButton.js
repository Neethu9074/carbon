/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import { websitesAlertingEventDetailsViewEditConfig } from 'in-alerting/smart-alerts/websites/alerting/tracker';
import { goToAlertConfig } from 'in-websites/navigation/paths';
import Button from 'in-new-components/Button';

export default function WebsiteAlertConfigButton({ alertConfig }) {
  return (
    <Button
      kind="secondary"
      onClick={() => {
        websitesAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
        goToAlertConfig(alertConfig.id, alertConfig.created, alertConfig.websiteId);
      }}
    >
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}

WebsiteAlertConfigButton.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
