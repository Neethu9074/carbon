/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { AlertEvaluationType } from '@instana/types';

import {
  replacePlaceholdersWithMarkup,
  highlightPlaceholdersInHtml
} from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';
import { placeholdersByEvaluationType } from 'in-alerting/smart-alerts/applications/inventory/placeholders';
import { severityPlaceholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';

interface GetAlertTitleWithPlaceholderHighlightingParams {
  evaluationType: AlertEvaluationType;
  configName: string;
}

export default function getAlertTitleWithPlaceholderHighlighting({
  configName,
  evaluationType
}: GetAlertTitleWithPlaceholderHighlightingParams) {
  return replacePlaceholdersWithHighlighting(evaluationType, configName);
}

export function replacePlaceholdersWithHighlighting(evaluationType: AlertEvaluationType, configName: string) {
  const placeholders = placeholdersByEvaluationTypeAndSeverity(evaluationType);

  return replacePlaceholdersWithMarkup(placeholders, configName);
}

export function placeholdersByEvaluationTypeAndSeverity(evaluationType: AlertEvaluationType) {
  return [...placeholdersByEvaluationType[evaluationType], severityPlaceholder];
}

export function getAlertDescriptionWithPlaceholderHighlighting({
  configName: description,
  evaluationType
}: GetAlertTitleWithPlaceholderHighlightingParams) {
  return highlightPlaceholdersInHtml(description, placeholdersByEvaluationTypeAndSeverity(evaluationType));
}
