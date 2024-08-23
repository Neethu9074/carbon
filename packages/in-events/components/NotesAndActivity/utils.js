/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from 'in-i18n';

export function getNotes(event) {
  const notes =
    (event?.get('journals') || event?.get('notesUiObjects'))
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

// We want to display "You" instead of the user name if its
// your chat bubble
// Append date to end of text
export function noteNameAndTimeFormat(myBubble, note, date, type) {
  // const typeExt = type === 'external_note' || type === 'external_change';
  const typeNote = type === 'note';
  const aiGen = type === 'ai_generated'

  if (myBubble && typeNote) {
    return `${t('in-events:notes.you')}: ${date}`;
  } else if (aiGen) {
    return `watsonx | ${date}`;
  } else if (typeNote) {
    return `${note?.author} | ${date}`;
  } else {
    return (
      <>
        {`${note?.origin} | ${note?.label}`}
        <div style={{ paddingTop: '.25rem' }}>{`${note?.author} | ${date}`}</div>
      </>
    );
  }
}

// Filters through the notes to make sure a notes includes
// the search input in either the author name or contents
export function filterSearchNotes(notes, input) {
  const result = notes.filter(note => {
    const author = note?.author?.toLowerCase() || '';
    const contents = note?.contents?.toLowerCase() || '';
    // Flatten the array of arrays down
    const data = note?.data?.flat(1) || [];
    // Loop through the data and see the input is found
    // The created boolean area is checked in the next step to see
    // At least one true exists
    const dataBools = data.map(e => e.toLowerCase().includes(input));
    return author.includes(input) || contents.includes(input) || dataBools.includes(true);
  });

  return result;
}

export function createDataString(data) {
  var dataString = [];
  data.map(entry => {
    // There are three index values but only first and last are used
    // Key
    const entryOne = entry[0] || '';
    // Before Change
    // const entryTwo = entry[1] || ''
    // After Change
    const entryThree = entry[2] || '';
    const entryString = `${entryOne}: ${entryThree}\n`;
    dataString.push(entryString);
  });
  return dataString;
}
