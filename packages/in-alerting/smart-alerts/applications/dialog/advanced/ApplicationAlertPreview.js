/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import { MultiThresholdAlertPreviewCommon } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon';
import ApplicationAlertPreviewHeadline from 'in-alerting/smart-alerts/applications/dialog/advanced/ApplicationAlertPreviewHeadline';
import { AlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { getDescriptionPlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { t } from 'in-i18n';

export function ApplicationAlertPreview({ form, applicationLabel, evaluationType, isTearSheet }) {
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;
  const isCriticalDefined = criticalThresholdField.get('isCheckboxSelected').value;
  const entityLabel = getEntityLabel(applicationLabel, evaluationType);
  const entityIconType = getEntityIconType(evaluationType);

  return (
    <MultiThresholdAlertPreviewCommon
      form={form}
      getDescriptionPlaceholder={getDescriptionPlaceholder}
      isWarningDefined={isWarningDefined}
      isCriticalDefined={isCriticalDefined}
      entityLabel={entityLabel}
      entityIconType={entityIconType}
      renderHeadline={() => <ApplicationAlertPreviewHeadline form={form} />}
      isTearSheet={isTearSheet}
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
  evaluationType: PropTypes.string,
  isTearSheet: PropTypes.bool
};
