/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MultiThresholdAlertPreviewCommon } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreviewCommon';
import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { Placeholder } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { t } from 'in-i18n';

interface MultiThresholdAlertPreviewProps {
  form: MapForm<any>;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
  placeholderTitle?: string;
  placeholderDescription?: { WARNING?: string; CRITICAL?: string };
  allowedPlaceholders?: ReadonlyArray<Readonly<Placeholder>>;
}

export function MultiThresholdAlertPreview({
  form,
  getDescriptionPlaceholder,
  placeholderTitle,
  placeholderDescription,
  allowedPlaceholders
}: MultiThresholdAlertPreviewProps) {
  const warningThresholdField = form.get('threshold').get('warningThreshold') as MapForm<any>;
  const criticalThresholdField = form.get('threshold').get('criticalThreshold') as MapForm<any>;
  const warningThresholdValue = warningThresholdField.get('value').value;
  const criticalThresholdValue = criticalThresholdField.get('value').value;
  const isWarningThresholdDefined = !isEmpty(warningThresholdValue);
  const isCriticalThresholdDefined = !isEmpty(criticalThresholdValue);
  const metricLabel = form.get('hiddenFields').get('metricLabel').value;
  const entityLabel = metricLabel
    ? metricLabel
    : t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.preview.subtitle');
  const name = form.get('name').value;
  const titleWithReplacedPlaceholders = name
    ? replacePlaceholdersWithMarkup(allowedPlaceholders ?? [], name, ({ name }) => name)
    : placeholderTitle || getTitlePlaceholder();

  return (
    <MultiThresholdAlertPreviewCommon
      form={form}
      getDescriptionPlaceholder={getDescriptionPlaceholder}
      descriptionPlaceholder={placeholderDescription}
      isWarningDefined={isWarningThresholdDefined}
      isCriticalDefined={isCriticalThresholdDefined}
      entityLabel={entityLabel}
      entityIconType="lib_infrastructure"
      renderHeadline={() => <AlertPreviewHeadline title={titleWithReplacedPlaceholders} />}
    />
  );
}
