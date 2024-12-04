/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Pill, Stack } from '@instana/components';

import { AlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { t } from 'in-i18n';

interface ThresholdAlertPreviewProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
  entityLabel: string;
  entityIconType: string;
  severity: number;
  renderHeadline: () => React.ReactNode;
  isTearSheet: boolean;
}

export function ThresholdAlertPreview({
  form,
  getDescriptionPlaceholder,
  entityLabel,
  entityIconType,
  severity,
  renderHeadline,
  isTearSheet
}: ThresholdAlertPreviewProps) {
  const alertPreviewPillLabels: { [key: number]: string } = {
    5: t('in-alerting:smartAlerts.components.smartAlertDialog.warningAlertPreviewLabel'),
    10: t('in-alerting:smartAlerts.components.smartAlertDialog.criticalAlertPreviewLabel')
  };

  return (
    <Stack gap="xsmall">
      <Pill kind="primary" type="high-contrast">
        {alertPreviewPillLabels[severity]}
      </Pill>
      <AlertPreview
        form={form}
        renderHeadline={renderHeadline}
        getDescriptionPlaceholder={getDescriptionPlaceholder}
        entityLabel={entityLabel}
        entityIconType={entityIconType}
        severity={severity}
        isTearSheet={isTearSheet}
        isMultiThreshold
      />
    </Stack>
  );
}
