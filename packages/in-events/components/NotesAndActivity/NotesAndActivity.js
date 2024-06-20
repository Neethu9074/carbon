/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import {
  SvgIcon,
  CarbonButton,
  CarbonTag,
  CarbonTextArea,
  CarbonLayer,
  CarbonInlineLoading
} from '@instana/components';

// Not using Carbon tooltip since tooltip has not been migrated
// Using Carbon tooltip would cause mismatch in design on the page
// since tooltip is used in many places on this page
import Tooltip from 'in-components/Tooltip';
import { EVENT_NOTES_SUBMIT, EVENT_SIDE_PANEL_CLICK } from 'in-services/tracking/eventNames';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { getNotes, validTextEntry, noteNameAndTimeFormat } from './utils';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { track } from 'in-services/tracking/trackers';
import { annotateEvent } from 'in-stores/events';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './NotesAndActivity.mless';

export function NotesAndActivity(props) {
  const { event } = props;
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');

  const loading = event == undefined;

  // Boolean to control when the notes section is opened
  const [displayNotes, setDisplayNotes] = useState(false);
  // Current value of the typed out note
  const [note, setNote] = useState('');

  function toggleSidePanel() {
    setDisplayNotes(!displayNotes);
    track(EVENT_SIDE_PANEL_CLICK, { incidentId });
  }

  // We ONLY want to display Notes and Activity for incidents
  if (eventType != 'incident') {
    return null;
  }

  return (
    <>
      <div className={locals.verticalBorderNotes} />
      {!displayNotes ? (
        <Tooltip content={t('in-events:notes.openNotes')}>
          <div onClick={() => toggleSidePanel()} className={locals.closedNotesWrapper}>
            {t('in-events:notes.notesActivity')}
            <SvgIcon type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'} size="s" />
          </div>
        </Tooltip>
      ) : (
        <CarbonLayer className={locals.notesHeaderWrapper}>
          <div className={locals.headerWrapper}>
            {t('in-events:notes.notesActivity')}
            <CarbonTag type="blue">{t('in-events:notes.techPreview')}</CarbonTag>
            <Tooltip content={t('in-events:notes.closeNotes')}>
              <SvgIcon
                onClick={() => toggleSidePanel()}
                type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'}
                size="s"
                className={locals.notesIcon}
              />
            </Tooltip>
          </div>
          <div className={locals.notes}>
            {loading ? (
              <div className={locals.loading}>
                <CarbonInlineLoading />
              </div>
            ) : (
              <>
                <div className={locals.inputSection}>
                  <CarbonTextArea
                    labelText={t('in-events:notes.incidentNotes')}
                    hideLabel
                    rows={5}
                    id="incidentNotes"
                    placeholder={t('in-events:notes.typeSomething')}
                    value={note}
                    onChange={e => {
                      setNote(e?.target?.value);
                    }}
                  />
                  <CarbonButton
                    onClick={() => handleSubmitNote(incidentId, note, user, setNote)}
                    className={locals.addNoteButton}
                    size={'md'}
                  >
                    {t('in-events:notes.addNote')}
                  </CarbonButton>
                </div>
                <CommentList notes={notes} preferredName={user.preferredName} />
              </>
            )}
          </div>
        </CarbonLayer>
      )}
    </>
  );
}

export function CommentList(props) {
  const { notes, preferredName } = props;
  return (
    <div className={locals.notesSection}>
      {notes?.length == 0 && <EmptyState />}
      {notes &&
        notes.map((entry, i) => {
          // Using i to iterate helps us traverse backwards that way notes are displayed
          // with the newest note at the top, oldest at the bottom
          const note = notes[notes.length - i - 1];
          const myBubble = note.author == preferredName;
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                {!myBubble && <SvgIcon type={'lib_user_avatar_filled_alt'} size="sm" className={locals.userIcon} />}
                <div className={locals.chatEntryInfo}>{noteNameAndTimeFormat(myBubble, note, date)}</div>
              </div>
              <ChatBubble user={note.author} text={note.contents} myBubble={myBubble} />
            </div>
          );
        })}
    </div>
  );
}

// Individual chat bubble that has differing colors based on
// if the text is from me or someone else
export function ChatBubble(props) {
  const { myBubble, text } = props;
  return (
    <div
      className={classNames({
        [locals.myBubble]: myBubble,
        [locals.otherBubble]: !myBubble,
        [locals.bubble]: true
      })}
    >
      {text}
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
    track(EVENT_NOTES_SUBMIT, { incidentId, author: userName });
  }
}

// Basic empty state for notes
export function EmptyState() {
  return (
    <div className={locals.emptyWrapper}>
      <h3 className={locals.emptyHeader}>{t('in-events:notes.noNotes')}</h3>
      <p className={locals.emptyInfo}>{t('in-events:notes.noNotesDetails')}</p>
    </div>
  );
}
