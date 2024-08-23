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
  CarbonInlineLoading,
  IconButton,
  CarbonSearch
} from '@instana/components';

// Not using Carbon tooltip since tooltip has not been migrated
// Using Carbon tooltip would cause mismatch in design on the page
// since tooltip is used in many places on this page
import Tooltip from 'in-components/Tooltip';
import { getNotes, validTextEntry, noteNameAndTimeFormat, filterSearchNotes, createDataString } from './utils';
import { EVENT_NOTES_SUBMIT, EVENT_AI_GENERATE_SUBMIT, EVENT_SIDE_PANEL_CLICK } from 'in-services/tracking/eventNames';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { annotateEvent } from 'in-stores/events';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './NotesAndActivity.mless';

export function OpenNotesAndActivity({ displayNotes, setDisplayNotes, event }) {
  const incidentId = event?.get('id');

  const openNotes = () => {
    const { pageRootName, productArea } = getViewTrackingMetaData();
    if (pageRootName && productArea) {
      const data = {
        parentPageName: pageRootName,
        parentPageCategory: productArea,
        CTA: EVENT_SIDE_PANEL_CLICK,
        path: location.hash
      };
      eventTracker({ data, segmentEventName: CTA_CLICKED });
    }

    track(EVENT_SIDE_PANEL_CLICK, { incidentId });

    setDisplayNotes(true);
  };

  if (!displayNotes) {
    return (
      <Tooltip content={t('in-events:notes.openNotes')}>
        <div onClick={openNotes} className={locals.closedNotesWrapper}>
          {t('in-events:notes.notesActivity')}
          <SvgIcon type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'} size="s" />
        </div>
      </Tooltip>
    );
  }
  return <></>;
}

export function NotesAndActivity(props) {
  const aiFlagEnabled = true;
  const { event, displayNotes, setDisplayNotes } = props;
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');

  const loading = event == undefined;

  // Boolean to control when the notes section is opened
  // const [displayNotes, setDisplayNotes] = useState(false);
  // Current value of the typed out note
  const [note, setNote] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openSearch, setOpenSearch] = useState(false);

  function toggleSidePanel() {
    setDisplayNotes(!displayNotes);
    const { pageRootName, productArea } = getViewTrackingMetaData();
    if (pageRootName && productArea) {
      const data = {
        parentPageName: pageRootName,
        parentPageCategory: productArea,
        CTA: EVENT_SIDE_PANEL_CLICK,
        path: location.hash
      };
      eventTracker({ data, segmentEventName: CTA_CLICKED });
    }

    track(EVENT_SIDE_PANEL_CLICK, { incidentId });
  }

  // We ONLY want to display Notes and Activity for incidents
  if (eventType != 'incident') {
    return null;
  }

  if (!displayNotes) {
    return <></>;
  }

  // TESTING PURPOSES ONLY
  notes.push({
    type: 'ai_generated',
    id: 'QNxHX2JGRWG5OayzLX3dgadfadsfadsg',
    parent: 'SIqsdfetSR2mFBzafaqKNVy1GQ',
    timestamp: 1722957105978,
    updated: 0,
    author: 'Denton Zan',
    metadata: {},
    contents: "This is the summary generated from AI.  This is a very high severity issue that needs immediate attention.  Restarts appear to be occuring."
  });
  notes.push({
    type: 'external_note',
    id: 'QNxHX2JGRWG5OayzLX3dgg',
    parent: 'SIqmHetSR2mFBzqKNVy1GQ',
    timestamp: 1722957105978,
    updated: 0,
    author: 'Quinn T.',
    metadata: {},
    origin: 'ServiceNow',
    internal: false,
    label: 'Additional comments',
    contents: 'This is an external_note that has been brought to you by.... SERVICE NOW!'
  });
  notes.push({
    type: 'external_field_change',
    id: 'QNxHX2JGRWG5OayzLX3dgg',
    parent: 'SIqmHetSR2mFBzqKNVy1GQ',
    timestamp: 1722957105978,
    updated: 0,
    author: 'Denton Zan',
    metadata: {},
    origin: 'ServiceNow',
    label: 'Field changes',
    data: [
      ['Priority', '0', '1 - Critical'],
      ['Incident state', 'opened', 'In progress'],
      ['Opened by', '', 'ITIL User']
    ]
  });
  // ^^^^^^^^^^^^^^^^^^^^^^^TESTING PURPOSES ONLY

  const filteredNotes = filterSearchNotes(notes, searchInput.toLowerCase());
  return (
    <CarbonLayer className={locals.notesHeaderWrapper}>
      <div className={locals.headerWrapper}>
        {t('in-events:notes.notesActivity')}
        <CarbonTag type="blue">{t('in-events:notes.techPreview')}</CarbonTag>
        <IconButton
          kind="action"
          onClick={() => setOpenSearch(!openSearch)}
          type={'lib_actions_search'}
          size="compact"
          className={locals.notesIcon}
        />
        <Tooltip content={t('in-events:notes.closeNotes')}>
          <IconButton
            kind="action"
            onClick={() => toggleSidePanel()}
            type={displayNotes ? 'lib_sidebar_to_right' : 'lib_sidebar_to_left'}
            size="compact"
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
            {openSearch && (
              <CarbonSearch
                placeholder="Search notes and activity"
                onChange={e => {
                  setSearchInput(e?.target?.value);
                }}
              />
            )}
            <QuickActions aiFlagEnabled={aiFlagEnabled} />
            <CommentList notes={filteredNotes} preferredName={user.preferredName} />
            <CommentInput note={note} user={user} setNote={setNote} incidentId={incidentId} />
          </>
        )}
      </div>
    </CarbonLayer>
  );
}

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
        placeholder={'Add comment'}
        value={note}
        id="incidentNotes"
        labelText="add incident notes"
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

export function CommentList(props) {
  const { notes, preferredName } = props;
  return (
    <div
      className={classNames({
        [locals.notesSection]: true
      })}
    >
      {notes &&
        notes.map((entry, i) => {
          // Using i to iterate helps us traverse backwards that way notes are displayed
          // with the newest note at the top, oldest at the bottom
          const note = notes[notes.length - i - 1];
          const myBubble = note.author == preferredName;
          const type = note.type;
          const aiGen = type === 'ai_generated'
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                {!myBubble && <SvgIcon type={!aiGen && 'lib_user_avatar_filled_alt' || 'lib_ai_slug'} size={!aiGen && "regular" || "sm"} className={!aiGen && locals.userIcon || locals.aiIcon} viewBox={aiGen && "4 4 24 24" || "0 0 32 32"}/>}
                <div className={locals.chatEntryInfo}>{noteNameAndTimeFormat(myBubble, note, date, type)}</div>
                {aiGen && <SvgIcon type={'lib_ai_slug'} className={locals.aiIconSlug} size="xs" viewBox={"4 4 24 24"}/> }
              </div>
              <ChatBubble text={note.contents} data={note.data} myBubble={myBubble} type={type} />
            </div>
          );
        })}
    </div>
  );
}

// Individual chat bubble that has differing colors based on
// if the text is from me or someone else
export function ChatBubble(props) {
  const { myBubble, text, data, type } = props;
  // Currently we have 3 types of bubbles
  const extNote = type === 'external_note';
  const extChange = type === 'external_field_change';
  const note = type === 'note';
  const aiGen = type === 'ai_generated';
  return (
    <div
      className={classNames({
        [locals.myBubble]: myBubble && note,
        [locals.otherBubble]: !myBubble && note,
        [locals.ext]: extNote || extChange,
        [locals.bubble]: true
      })}
    >
      {text ? text : createDataString(data)}
    </div>
  );
}

// Main view that gives an overview for this side panel
// Gives the user the options to add a note or generate a summary
export function QuickActions(props) {
  const { aiFlagEnabled } = props;
  const header = aiFlagEnabled && t('in-events:notes.summarizeIncident') || 'Add notes for this incident'
  const description = aiFlagEnabled && t('in-events:notes.summarizeIncidentDescription') || 'Try adding notes to help you and your team gain a quick understanding of what has happened.'
  const summary = aiFlagEnabled && t('in-events:notes.generateSummary')
  return (
    <div className={locals.quickActionWrapper}>
      <SvgIcon className={locals.questionIcon} type="lib_help_error_help_circle" />
      <div>
        <div className={locals.quickActionsHeader}>{header}</div>
        <div className={locals.quickActionsDescription}>{description}</div>
        {aiFlagEnabled &&
          <CarbonButton
            kind={'tertiary'}
            className={locals.actionsButton}
            size={'sm'}
            renderIcon={() => <SvgIcon type="lib_generate_ai" color="currentColor" size="xs" />}
            // onClick={() => handleAIGenerateNote()}
          >
            <div className={locals.quickActionButtonContents}>{summary}</div>
          </CarbonButton>
        }
      </div>
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

// export function handleAIGenerateNote() {
//   // Dont fire off a new note without there being something written
//   const newNote = {
//     incidentId: incidentId,
//     author: userName,
//     action: 'create',
//     contents: note
//   };
//   annotateEvent(newNote);
//   const { pageRootName, productArea } = getViewTrackingMetaData();
//   if (pageRootName && productArea) {
//     const data = {
//       parentPageName: pageRootName,
//       parentPageCategory: productArea,
//       CTA: EVENT_AI_GENERATE_SUBMIT,
//       path: location.hash
//     };
//     eventTracker({ data, segmentEventName: CTA_CLICKED });
//   }
//   track(EVENT_AI_GENERATE_SUBMIT, { incidentId, author: userName });
// }
