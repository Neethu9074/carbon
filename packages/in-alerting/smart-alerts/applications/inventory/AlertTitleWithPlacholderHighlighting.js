/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { replacePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/applications/inventory/placeholders';
import theme from 'in-themes/theme';

export default function AlertTitleWithPlaceholderHighlighting({ configName, evaluationType }) {
  return replacePlaceholdersWithHighlighting(evaluationType, configName);
}

export function replacePlaceholdersWithHighlighting(evaluationType, configName) {
  return replacePlaceholdersWithMarkup(evaluationType, configName, highlightPlaceholderReplacer);
}

function highlightPlaceholderReplacer({ template, i }) {
  return [
    '${',
    <span key={`${i}`} style={{ color: theme.lib.colors.pink800 }}>
      {removePlaceholderSpecificCharacters(template)}
    </span>,
    '}'
  ];
}

function removePlaceholderSpecificCharacters(placeholderValue) {
  return placeholderValue.replace(/[${}]/g, '');
}
