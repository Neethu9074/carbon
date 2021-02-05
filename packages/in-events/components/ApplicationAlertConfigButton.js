/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
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
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}

ApplicationAlertConfigButton.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
