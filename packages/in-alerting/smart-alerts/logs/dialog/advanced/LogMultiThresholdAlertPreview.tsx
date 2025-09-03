/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MultiThresholdAlertPreviewCommon } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon';
import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { Placeholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import { t } from 'in-i18n';

interface LogMultiThresholdAlertPreviewProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>, severity?: number) => string;
  allowedPlaceholders?: ReadonlyArray<Readonly<Placeholder>>;
}

export function LogMultiThresholdAlertPreview({
  form,
  getDescriptionPlaceholder,
  allowedPlaceholders
}: LogMultiThresholdAlertPreviewProps) {
  const isWarningThresholdSelected = form.get('threshold').get('warningThreshold').get('isCheckboxSelected')?.value;
  const isCriticalThresholdSelected = form.get('threshold').get('criticalThreshold').get('isCheckboxSelected')?.value;
  const entityLabel = t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.preview.subtitle');
  const name = form.get('name').value;

  return (
    <MultiThresholdAlertPreviewCommon
      form={form}
      getDescriptionPlaceholder={getDescriptionPlaceholder}
      isWarningDefined={isWarningThresholdSelected}
      isCriticalDefined={isCriticalThresholdSelected}
      entityLabel={entityLabel}
      entityIconType="lib_application_logging"
      renderHeadline={() => (
        <AlertPreviewHeadline
          title={
            name
              ? replacePlaceholdersWithMarkup(allowedPlaceholders ?? [], name, ({ name }) => name)
              : getTitlePlaceholder()
          }
        />
      )}
      descriptionWithReplacedPlaceholders={replacePlaceholdersWithMarkup(
        allowedPlaceholders ?? [],
        form.get('description').value,
        ({ name }) => name
      )}
    />
  );
}
