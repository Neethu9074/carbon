/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import {
  highlightPlaceholderReplacer,
  replacePlaceholdersWithMarkup
} from 'in-alerting/smart-alerts/applications/inventory/placeholders';

export default function AlertTitleWithPlaceholderHighlighting({ configName }) {
  return replacePlaceholdersWithMarkup(configName, highlightPlaceholderReplacer);
}
