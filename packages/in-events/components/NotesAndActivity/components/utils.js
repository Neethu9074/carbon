/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { EVENT_NOTES_EDIT_SUBMIT, EVENT_NOTES_DELETE_SUBMIT } from 'in-services/tracking/eventNames';
import { TYPE_NOTE, TYPE_AI_SUMMARY } from 'in-events/components/NotesAndActivity/utils';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { annotateEvent } from 'in-stores/events';
import { user } from 'in-stores/user';
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
/**
 * Formats the note name and time based on the type of note and whether it has been edited.
 * @param {boolean} myBubble - Indicates if the note is from the current user.
 * @param {object} note - The note object containing the author and origin information.
 * @param {string} date - The date of the note.
 * @param {string} type - The type of note (TYPE_NOTE or TYPE_AI_SUMMARY).
 * @param {boolean} isEdited - Indicates if the note has been edited.
 * @returns {string} The formatted note name and time.
 */
export function noteNameAndTimeFormat(myBubble, note, date, type, isEdited = false) {
  const typeNote = type === TYPE_NOTE;
  const aiGen = type === TYPE_AI_SUMMARY;
  if (myBubble && typeNote) {
    return (
      (!isEdited && `${t('in-events:notes.you', { date: date })}`) ||
      `${t('in-events:notes.youEdited', { date: date })}`
    );
  } else if (aiGen) {
    return `${t('in-events:notes.watsonx', { date: date })}`;
  } else if (typeNote) {
    return (
      (!isEdited && `${t('in-events:notes.nameDate', { name: note?.author, date: date })}`) ||
      `${t('in-events:notes.nameDateEdited', { name: note?.author, date: date })}`
    );
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
    const entryOne = entryArray[0]?.replace('_', ' ') || '';
    // 1 - Old Value
    // 2 - New Value
    const entryThree = entryArray[2] || '';
    const entryString = `${entryOne.charAt(0).toUpperCase() + entryOne.slice(1)}: ${entryThree}\n`;
    dataString.push(entryString);
  });
  return dataString;
}

// Function to handle the editing and updating of a note
/**
 * Handle the update or delete of a note.
 * @param {string} incidentId - The ID of the incident the note belongs to.
 * @param {string} note - The contents of the note.
 * @param {function} setNote - The function to set the note text field.
 * @param {function} setEditNoteId - The function to reset the edit note state.
 * @param {array} editNoteId - The ID of the note being edited and a boolean value for true (editing) or false (deleting).
 */
export function handleUpdateDeleteNote(incidentId, note, setNote, setEditNoteId, editNoteId) {
  // EditNoteId is false whenever its reset but when assigned its an array
  // Note ID, boolean value for true (editing), false (deleting)
  // [<noteID>, <boolean>]
  const actionToTake = (editNoteId && editNoteId[1] && 'update') || 'delete';
  sendUpdateDeleteNote({
    incidentId: incidentId,
    author: user.preferredName,
    authorId: user.id,
    action: actionToTake,
    contents: note,
    currentId: editNoteId[0]
  });
  if (actionToTake == 'delete') {
    handleTracking(incidentId, EVENT_NOTES_DELETE_SUBMIT);
  } else if (actionToTake == 'edit') {
    handleTracking(incidentId, EVENT_NOTES_EDIT_SUBMIT);
  }
  // On submission we want to clear the note text field and reset edit note state
  setNote('');
  setEditNoteId(false);
}

// note object may contain
// {
//   incidentId: (incident.get('id')),
//   author: (username),
//   authorId: (user.id),
//   action: (either 'create', update', or 'delete'),
//   contents: (only for 'create' and 'update')
//   currentId: (only for 'update' and 'delete', refers to note's ID)
// }
function sendUpdateDeleteNote(note) {
  annotateEvent(note);
}

// Check to make sure the recipients are valid
// Expects a string split by commas
export function validRecipients(recipients) {
  const isString = typeof recipients === 'string';
  if (!isString) return false;
  const validEmails = [];
  const recipientsList = recipients?.split(',');
  recipientsList?.map(e => {
    const validateEmail = email => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    // Null means its invalid
    const valid = validateEmail(e.trim()) != null;
    validEmails.push(valid);
  });
  // If false exists then there is an error
  return recipientsList && !validEmails.includes(false);
}

// We want to track the clicks to segment
/**
 * Handle tracking for a specific element click.
 * @param {string} id - The ID of the element.
 * @param {string} trackingName - The name of the tracking event.
 */
export function handleTracking(id, trackingName) {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: trackingName,
      path: location.hash
    };
    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }
  track(trackingName, { id, author: user.preferredName });
}
