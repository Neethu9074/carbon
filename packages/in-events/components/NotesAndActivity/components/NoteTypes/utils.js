/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

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
