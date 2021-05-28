/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { applicationsAlertingEventDetailsViewEditConfig } from 'in-alerting/smart-alerts/applications/tracker';
import { getLinkToAlertConfig, getLinkToGlobalAlertConfig } from 'in-applications/navigation/paths';
import { t } from 'in-i18n';

export default function ApplicationAlertConfigButton({ applicationId, alertConfig, isGlobalSmartAlert }) {
  return (
    <Button
      kind="secondary"
      onClick={() => {
        applicationsAlertingEventDetailsViewEditConfig({ id: alertConfig.id });
      }}
      href$={(isGlobalSmartAlert ? getLinkToGlobalAlertConfig : getLinkToAlertConfig)(
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
