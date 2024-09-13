/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { CarbonTextArea, IconButton } from '@instana/components';

import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { EVENT_NOTES_SUBMIT } from 'in-services/tracking/eventNames';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { annotateEvent } from 'in-stores/events';
import { validTextEntry } from './utils';
import { t } from 'in-i18n';

import locals from './CommentInput.mless';

// Handle the view where inputting a note occurs
// Carbon Text Area
// Icon Button
export function CommentInput(props) {
  const [keyBoardSubmit, onKeyBoardSubmit] = useState(false);
  const { note, user, setNote, incidentId } = props;
  return (
    <div className={locals.commentInputWrapperNotes}>
      <CarbonTextArea
        rows={3}
        placeholder={t('in-events:notes.addComment')}
        value={note}
        id="incidentNotes"
        labelText={t('in-events:notes.notesLabelText')}
        hideLabel
        onChange={e => {
          // Updates notes when Shift + Enter is not hit
          if (e?.keyCode !== 13 || (e.shiftKey === false && !keyBoardSubmit)) {
            setNote(e?.target?.value);
          }
          if (keyBoardSubmit) {
            onKeyBoardSubmit(false);
            setNote('');
          }
        }}
        onKeyDown={e => {
          // We want to submit the note on Enter
          // If shift is pressed we DONT submit (allow for carriage return)
          if (e?.keyCode === 13 && e.shiftKey === false) {
            onKeyBoardSubmit(true);
            handleSubmitNote(incidentId, note, user, setNote);
          }
        }}
      />
      <IconButton
        onClick={() => handleSubmitNote(incidentId, note, user, setNote)}
        type={'lib_message_send'}
        size="compact"
        kind="primary"
        className={locals.commentInputIcon}
      />
    </div>
  );
}

// Handle the note submission
// Requires the incidentID, note, user, and setNote function
// Dont allow the annotateEvent call if note is empty
// Once you submit the event clear the note value with SetNote
export function handleSubmitNote(incidentId, note, user, setNote) {
  const userName = user.preferredName;
  // Dont fire off a new note without there being something written
  if (validTextEntry(note)) {
    const newNote = {
      incidentId: incidentId,
      author: userName,
      action: 'create',
      contents: note
    };
    annotateEvent(newNote);
    setNote('');
    const { pageRootName, productArea } = getViewTrackingMetaData();
    if (pageRootName && productArea) {
      const data = {
        parentPageName: pageRootName,
        parentPageCategory: productArea,
        CTA: EVENT_NOTES_SUBMIT,
        path: location.hash
      };
      eventTracker({ data, segmentEventName: CTA_CLICKED });
    }
    track(EVENT_NOTES_SUBMIT, { incidentId, author: userName });
  }
}
