/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { string } from 'prop-types';

import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import { t } from 'in-i18n';

// Converting the incident summary
export function convertIncidentSummaryToString(data) {
  var stringSummary = `${t('in-events:notes.summaryAIGen')}\n\n${t('in-events:notes.sumGenerated')}\n\n`;
  data?.map(entry => {
    const props = Object.fromEntries(entry);
    const entityLabel = (props.entityLabel && props.entityLabel !== '' && props.entityLabel) || props.entityName;
    const entitySummary = `${props.entitySummary}\n`;
    stringSummary += `${entityLabel}\n`;
    stringSummary += `${entitySummary}\n`;
  });

  return stringSummary;
}

// Taking the in the response of the notes summary and converting it to a string
export function convertNotesSummaryToString(data) {
  var stringSummary = `${t('in-events:notes.sumNotes')}\n\n`;
  if (data?.length == 0) {
    stringSummary += `${t('in-events:notes.noSumNotes')}\n`;
  }
  data?.map(entry => {
    stringSummary += `${entry}\n`;
  });

  return stringSummary;
}

// Taking the in the response of the actions and converting it to a string
export function convertActionsToString(data) {
  var stringSummary = `${t('in-events:notes.sumActions')}\n\n`;
  if (data?.length == 0 || data?.size == 0) {
    stringSummary += `${t('in-events:notes.noSumActions')}\n`;
  }
  data?.map(entry => {
    const props = Object.fromEntries(entry);
    const actionName = props.actionName;
    const actionType = props.actionType;
    stringSummary += `${actionName}\n`;
    stringSummary += `type: ${actionType}\n`;
  });

  return stringSummary;
}

// Return summary of top three recommended actions
export function convertTopActionsToString(actions) {
  // Omit from summary if no actions are found
  if (!actions || actions.length == 0) {
    return '';
  }
  let stringSummary = '';
  const highConfidenceCount = actions.filter(x => x.confidence === 'high').length;
  const totalCount = actions.length;
  if (highConfidenceCount === 0) {
    if (totalCount === 1) {
      // "There is one recommended action.",
      stringSummary += t('in-events:notes.introRecActionSingularNoLevel');
    } else {
      // "There are {{number}} recommended actions."
      stringSummary += t('in-events:notes.introRecActionPluralNoLevel', { number: totalCount });
    }
  } else if (highConfidenceCount === 1) {
    // "There is one recommended action with a high confidence level."
    stringSummary += t('in-events:notes.introRecActionSingular');
  } else {
    // "There are {{number}} recommended actions with a high confidence level."
    stringSummary += t('in-events:notes.introRecActionPlural', { number: highConfidenceCount });
  }
  stringSummary += ` ${t('in-events:notes.sumActionsTitle')}\n\n`;
  actions.slice(0, 3).forEach((entry, index) => {
    stringSummary += `${index + 1}: ${entry.entity?.name} `;
    stringSummary += `(${entry.entity?.description})\n`;
  });
  return stringSummary;
}
