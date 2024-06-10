/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from 'in-i18n';

export function getNotes(event) {
  const notes =
    event
      ?.get('notesUiObjects')
      ?.toArray()
      .filter(x => x && x.get('type') == 'note')
      .map(x => {
        return {
          type: x.get('type'),
          id: x.get('id'),
          parent: x.get('parent'),
          timestamp: x.get('timestamp'),
          author: x.get('author'),
          metadata: x.get('metadata'),
          contents: x.get('contents'),
          updated: x.get('updated')
        };
      }) || [];
  return notes;
}

// Simple function to check if text is not empty
export function validTextEntry(text) {
  if (text?.trim() == '' || !text) {
    return false;
  }
  return true;
}

// We want to display "You" in stead of youre user name if its
// your chat bubble
// Append date to end of text
export function noteNameAndTimeFormat(myBubble, note, date) {
  if (myBubble) {
    return `${t('in-events:notes.you')} | ${date}`;
  } else {
    return `${note?.author} | ${date}`;
  }
}
