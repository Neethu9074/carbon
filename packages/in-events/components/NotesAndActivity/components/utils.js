/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TYPE_NOTE, TYPE_AI_SUMMARY } from '../utils';
import { t } from 'in-i18n';

// Simple function to check if text is not empty
export function validTextEntry(text) {
  if (text?.trim() == '' || !text) {
    return false;
  }
  return true;
}

// We want to display "You" instead of the user name if its
// your chat bubble
// Append date to end of text
export function noteNameAndTimeFormat(myBubble, note, date, type) {
  const typeNote = type === TYPE_NOTE;
  const aiGen = type === TYPE_AI_SUMMARY;

  if (myBubble && typeNote) {
    return `${t('in-events:notes.you')} ${date}`;
  } else if (aiGen) {
    return `watsonx ${date}`;
  } else if (typeNote) {
    return `${note?.author} ${date}`;
  } else {
    return `${note?.origin} ${date}`;
  }
}

// Convert an array of arrays to determine before and after values
// of type 'external_field_change'
//
// Sample input expected:
// [
//   ['Priority', '0', '1 - Critical'],
//   ['Incident state', 'opened', 'In progress'],
//   ['Opened by', '', 'ITIL User']
// ]
export function createDataString(data) {
  var dataString = [];
  data?.map(entry => {
    const entryArray = entry?._tail?.array;
    // There are three index values but only first and last are used
    // 0 - Key
    const entryOne = entryArray[0] || '';
    // 1 - Old Value
    // 2 - New Value
    const entryThree = entryArray[2] || '';
    const entryString = `${entryOne.charAt(0).toUpperCase() + entryOne.slice(1)}: ${entryThree}\n`;
    dataString.push(entryString);
  });
  return dataString;
}

export function getSummary(data) {
  var dataString = [];
  data?.map(entry => {
    const entitySummary = `${entry.entitySummary}\n`;
    dataString.push(entitySummary);
  });
  return dataString;
}
