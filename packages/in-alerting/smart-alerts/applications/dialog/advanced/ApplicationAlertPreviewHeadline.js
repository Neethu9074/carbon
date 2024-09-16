/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { placeholdersByEvaluationType } from 'in-alerting/smart-alerts/applications/inventory/placeholders';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { t } from 'in-i18n';

export default function ApplicationAlertPreviewHeadline({ form, isTearSheet }) {
  const manuallyChangedTitle = form.get('name').value;
  const evaluationType = form.get('evaluationType').value;
  const placeholders = placeholdersByEvaluationType[evaluationType];

  const titleWithReplacedPlaceholders = replacePlaceholdersWithMarkup(
    placeholders,
    manuallyChangedTitle,
    ({ name }) => name
  );

  return (
    <AlertPreviewHeadline
      title={
        manuallyChangedTitle
          ? titleWithReplacedPlaceholders
          : isTearSheet
          ? t('in-alerting:smartAlerts.components.smartAlertDialog.alertPreviewDefaultTitle')
          : getTitlePlaceholder(form)
      }
    />
  );
}
