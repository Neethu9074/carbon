/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { placeholdersByEvaluationTypeAndSeverity } from 'in-alerting/smart-alerts/applications/inventory/getAlertTitleWithPlaceholderHighlighting';
import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { t } from 'in-i18n';

export default function ApplicationAlertPreviewHeadline({ form }) {
  const title = form.get('name').value;
  const evaluationType = form.get('evaluationType').value;
  const placeholders = placeholdersByEvaluationTypeAndSeverity(evaluationType);

  const titleWithReplacedPlaceholders = replacePlaceholdersWithMarkup(placeholders, title, ({ name }) => name);

  return <AlertPreviewHeadline title={title ? titleWithReplacedPlaceholders : getTitlePlaceholder(form)} />;
}
