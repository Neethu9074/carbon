/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import ApplicationAlertPreviewHeadline from 'in-alerting/smart-alerts/applications/dialog/advanced/ApplicationAlertPreviewHeadline';
import { AlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { getDescriptionPlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { t } from 'in-i18n';

export function ApplicationAlertPreview({ form, applicationLabel, evaluationType }) {
  const entityLabel = getEntityLabel(applicationLabel, evaluationType);
  const entityIconType = getEntityIconType(evaluationType);

  return (
    <AlertPreview
      form={form}
      renderHeadline={() => <ApplicationAlertPreviewHeadline form={form} />}
      getDescriptionPlaceholder={getDescriptionPlaceholder}
      entityLabel={entityLabel}
      entityIconType={entityIconType}
    />
  );
}

function getEntityIconType(evaluationType) {
  if (evaluationType === 'PER_AP_ENDPOINT') {
    return 'lib_application_endpoint';
  }
  if (evaluationType === 'PER_AP_SERVICE') {
    return 'lib_application_service';
  }
  return 'lib_application';
}

function getEntityLabel(applicationLabel, evaluationType) {
  if (evaluationType === 'PER_AP_ENDPOINT') {
    return t('in-alerting:smartAlerts.applications.advanced.endpointNamePlaceholder');
  }
  if (evaluationType === 'PER_AP_SERVICE') {
    return t('in-alerting:smartAlerts.applications.advanced.serviceNamePlaceholder');
  }
  return applicationLabel ?? t('in-alerting:smartAlerts.applications.advanced.applicationNamePlaceholder');
}

AlertPreview.propTypes = {
  form: PropTypes.object.isRequired,
  applicationLabel: PropTypes.string,
  evaluationType: PropTypes.string
};
