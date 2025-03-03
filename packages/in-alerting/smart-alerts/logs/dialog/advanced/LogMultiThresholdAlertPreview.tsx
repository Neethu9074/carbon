/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MultiThresholdAlertPreviewCommon } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon';
import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import { t } from 'in-i18n';

interface LogMultiThresholdAlertPreviewProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>, severity?: number) => string;
}

export function LogMultiThresholdAlertPreview({ form, getDescriptionPlaceholder }: LogMultiThresholdAlertPreviewProps) {
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdValue = warningThresholdField.get('value').value;
  const criticalThresholdValue = criticalThresholdField.get('value').value;
  const isWarningThresholdDefined = !isEmpty(warningThresholdValue);
  const isCriticalThresholdDefined = !isEmpty(criticalThresholdValue);
  const entityLabel = t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.preview.subtitle');
  const title = form.get('name').value || getTitlePlaceholder();

  return (
    <MultiThresholdAlertPreviewCommon
      form={form}
      getDescriptionPlaceholder={getDescriptionPlaceholder}
      isWarningDefined={isWarningThresholdDefined}
      isCriticalDefined={isCriticalThresholdDefined}
      entityLabel={entityLabel}
      entityIconType="lib_application_logging"
      renderHeadline={() => <AlertPreviewHeadline title={title} />}
    />
  );
}
