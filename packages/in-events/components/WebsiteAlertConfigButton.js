/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { websitesAlertingEventDetailsViewEditConfig } from 'in-alerting/smart-alerts/websites/tracker';
import { goToAlertConfig } from 'in-websites/navigation/paths';
import { t } from 'in-i18n';

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
