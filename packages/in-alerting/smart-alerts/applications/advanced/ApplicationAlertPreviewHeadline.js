/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { AlertPreviewHeadline } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPreview';
import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/applications/inventory/placeholders';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/applications/form/formUtils';

export default function ApplicationAlertPreviewHeadline({ form }) {
  const manuallyChangedTitle = form.get('name').value;
  const titleWithReplacedplaceholders = replacePlaceholdersWithMarkup(manuallyChangedTitle, ({ name }) => name);
  return (
    <AlertPreviewHeadline title={manuallyChangedTitle ? titleWithReplacedplaceholders : getTitlePlaceholder(form)} />
  );
}
