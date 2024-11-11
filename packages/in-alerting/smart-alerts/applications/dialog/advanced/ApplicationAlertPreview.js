/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Pill, Stack, Message } from '@instana/components';

import ApplicationAlertPreviewHeadline from 'in-alerting/smart-alerts/applications/dialog/advanced/ApplicationAlertPreviewHeadline';
import { AlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getDescriptionPlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreview.mless';

export function ApplicationAlertPreview({ form, applicationLabel, evaluationType, isTearSheet }) {
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');
  const thresholdType = warningThresholdField.get('type').value;
  let isWarningDefined;
  let isCriticalDefined;
  if (thresholdType === HISTORIC_BASELINE || thresholdType === ADAPTIVE_BASELINE) {
    isWarningDefined = warningThresholdField.get('isCheckboxSelected').value;
    isCriticalDefined = criticalThresholdField.get('isCheckboxSelected').value;
  } else {
    isWarningDefined = !isEmpty(warningThresholdField.get('value')?.value);
    isCriticalDefined = !isEmpty(criticalThresholdField.get('value')?.value);
  }
  const entityLabel = getEntityLabel(applicationLabel, evaluationType);
  const entityIconType = getEntityIconType(evaluationType);

  return (
    <Stack gap="small">
      {!isWarningDefined && !isCriticalDefined && (
        <Message
          withIcon
          description={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPreviewMissingThresholdInfo')}
        />
      )}
      {isWarningDefined && (
        <div
          className={classNames({
            [locals.container]: true
          })}
        >
          <Stack gap="xsmall">
            <Pill kind="primary" type="high-contrast">
              {t('in-alerting:smartAlerts.components.smartAlertDialog.warningAlertPreviewLabel')}
            </Pill>
            <AlertPreview
              form={form}
              renderHeadline={() => <ApplicationAlertPreviewHeadline form={form} isTearSheet={isTearSheet} />}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              entityLabel={entityLabel}
              entityIconType={entityIconType}
              isTearSheet={isTearSheet}
              severity={5}
              isMultiThreshold
            />
          </Stack>
        </div>
      )}
      {isCriticalDefined && (
        <div
          className={classNames({
            [locals.container]: true
          })}
        >
          <Stack gap="xsmall">
            <Pill kind="primary" type="high-contrast">
              {t('in-alerting:smartAlerts.components.smartAlertDialog.criticalAlertPreviewLabel')}
            </Pill>
            <AlertPreview
              form={form}
              renderHeadline={() => <ApplicationAlertPreviewHeadline form={form} isTearSheet={isTearSheet} />}
              getDescriptionPlaceholder={getDescriptionPlaceholder}
              entityLabel={entityLabel}
              entityIconType={entityIconType}
              isTearSheet={isTearSheet}
              severity={10}
              isMultiThreshold
            />
          </Stack>
        </div>
      )}
    </Stack>
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
