/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import { useLinkToAlertConfig, useLinkToGlobalAlertConfigWithAPDashboard } from 'in-applications/navigation/paths';
import { APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { t } from 'in-i18n';

export default function ApplicationAlertConfigButton({ applicationId, alertConfig, isGlobalSmartAlert }) {
  const getLinkToGlobalAlertConfigWithAPDashboard = useLinkToGlobalAlertConfigWithAPDashboard();
  const getLinkToAlertConfig = useLinkToAlertConfig();
  const { trackCta } = useSegmentTracking();

  return (
    <Button
      kind="secondary"
      onClick={() => {
        trackCta(APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, { id: alertConfig.id });
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
