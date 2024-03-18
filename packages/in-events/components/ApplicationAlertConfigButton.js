/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/legacy';

import { useLinkToAlertConfig, useLinkToGlobalAlertConfigWithAPDashboard } from 'in-applications/navigation/paths';
import { applicationsAlertingEventDetailsViewEditConfig } from 'in-alerting/smart-alerts/applications/tracker';
import { t } from 'in-i18n';

export default function ApplicationAlertConfigButton({ applicationId, alertConfig, isGlobalSmartAlert }) {
  const getLinkToGlobalAlertConfigWithAPDashboard = useLinkToGlobalAlertConfigWithAPDashboard();
  const getLinkToAlertConfig = useLinkToAlertConfig();

  return (
    <Button
      kind="secondary"
      onClick={() => {
        applicationsAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
      }}
      href={(isGlobalSmartAlert ? getLinkToGlobalAlertConfigWithAPDashboard : getLinkToAlertConfig)(
        alertConfig.id,
        alertConfig.created,
        applicationId
      )}
    >
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}

ApplicationAlertConfigButton.propTypes = {
  applicationId: PropTypes.string.isRequired,
  alertConfig: PropTypes.shape({
    id: PropTypes.string.isRequired,
    created: PropTypes.number
  }),
  isGlobalSmartAlert: PropTypes.bool
};
