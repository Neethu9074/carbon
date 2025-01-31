/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { CarbonTextArea, IconButton } from '@instana/components';

import { validTextEntry, handleUpdateDeleteNote, handleTracking } from './utils';
import { EVENT_NOTES_SUBMIT } from 'in-services/tracking/eventNames';
import { annotateEvent } from 'in-stores/events';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './CommentInput.mless';

// Handle the view where inputting a note occurs
// Carbon Text Area
// Icon Button
export function CommentInput({ note, setNote, incidentId, editNoteId, setEditNoteId }) {
  const [keyBoardSubmit, onKeyBoardSubmit] = useState(false);
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
            // Scenario for handling editing of a note
            if (editNoteId) {
              handleUpdateDeleteNote(incidentId, note, setNote, setEditNoteId, editNoteId);
            } else {
              // submitting a new note
              handleSubmitNote(incidentId, note, setNote);
            }
          }
        }}
      />
      <SubmissionButtons
        editNoteId={editNoteId}
        setEditNoteId={setEditNoteId}
        incidentId={incidentId}
        note={note}
        setNote={setNote}
      />
    </div>
  );
}

// This function handles the submission options within the CommentInput area
// When the user is editing an existing note, they will have two options: save / cancel
// If it is not editing it will just use one button for the handling note submission
export function SubmissionButtons({ editNoteId, setEditNoteId, incidentId, note, setNote }) {
  const isEditing = editNoteId && editNoteId[1];
  return (
    <>
      {isEditing && (
        <IconButton
          onClick={() => {
            setEditNoteId(false);
            setNote('');
          }}
          type={'lib_openclose_cancel'}
          size="compact"
          kind="action"
          className={classNames({
            [locals.commentInputIcon]: true,
            [locals.bumpUp]: editNoteId
          })}
        />
      )}
      <IconButton
        onClick={() => {
          // Scenario for handling editing of a note
          if (isEditing) {
            handleUpdateDeleteNote(incidentId, note, setNote, setEditNoteId, editNoteId);
          } else {
            // submitting a new note
            handleSubmitNote(incidentId, note, setNote);
          }
        }}
        type={(isEditing && 'lib_check') || 'lib_message_send'}
        size="compact"
        kind={(isEditing && 'action') || 'primary'}
        className={classNames({
          [locals.commentInputIcon]: true,
          [locals.bumpDown]: isEditing
        })}
      />
    </>
  );
}

// Handle the note submission
// Requires the incidentID, note, user, and setNote function
// Dont allow the annotateEvent call if note is empty
// Once you submit the event clear the note value with SetNote
export function handleSubmitNote(incidentId, note, setNote) {
  const userName = user.preferredName;
  // Dont fire off a new note without there being something written
  if (validTextEntry(note)) {
    const newNote = {
      incidentId: incidentId,
      author: userName,
      authorId: user.id,
      action: 'create',
      contents: note
    };
    annotateEvent(newNote);
    setNote('');
    handleTracking(incidentId, EVENT_NOTES_SUBMIT);
  }
}
