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
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { Placeholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
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
  const isWarningThresholdSelected = form.get('threshold').get('warningThreshold').get('isCheckboxSelected')?.value;
  const isCriticalThresholdSelected = form.get('threshold').get('criticalThreshold').get('isCheckboxSelected')?.value;
  const metricLabel = form.get('hiddenFields').get('metricLabel').value;
  const entityLabel = metricLabel
    ? metricLabel
    : t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.preview.subtitle');
  const name = form.get('name').value;
  const description = form.get('description')?.value;
  const titleWithReplacedPlaceholders = name
    ? replacePlaceholdersWithMarkup(allowedPlaceholders ?? [], name, ({ name }) => name)
    : placeholderTitle || getTitlePlaceholder();

  const descriptionWithReplacedPlaceholders = replacePlaceholdersWithMarkup(
    allowedPlaceholders ?? [],
    description,
    ({ name }) => name
  );
  return (
    <MultiThresholdAlertPreviewCommon
      form={form}
      getDescriptionPlaceholder={getDescriptionPlaceholder}
      descriptionPlaceholder={placeholderDescription}
      isWarningDefined={isWarningThresholdSelected}
      isCriticalDefined={isCriticalThresholdSelected}
      entityLabel={entityLabel}
      entityIconType="lib_infrastructure"
      renderHeadline={() => <AlertPreviewHeadline title={titleWithReplacedPlaceholders} />}
      descriptionWithReplacedPlaceholders={descriptionWithReplacedPlaceholders}
    />
  );
}
