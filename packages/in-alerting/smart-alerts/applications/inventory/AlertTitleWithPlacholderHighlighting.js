/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { placeholdersByEvaluationType } from 'in-alerting/smart-alerts/applications/inventory/placeholders';

export default function AlertTitleWithPlaceholderHighlighting({ configName, evaluationType }) {
  return replacePlaceholdersWithHighlighting(evaluationType, configName);
}

export function replacePlaceholdersWithHighlighting(evaluationType, configName) {
  const placeholders = placeholdersByEvaluationType[evaluationType];

  return replacePlaceholdersWithMarkup(placeholders, configName);
}
