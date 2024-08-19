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
import { EVENT_NOTES_SUBMIT, EVENT_SIDE_PANEL_CLICK } from 'in-services/tracking/eventNames';
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
  const { event, displayNotes, setDisplayNotes } = props;
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');

  const loading = event == undefined;

  // Boolean to control when the notes section is opened
  // const [displayNotes, setDisplayNotes] = useState(false);
  // Current value of the typed out note
  const [note, setNote] = useState('');
  const [viewInputText, setViewInputText] = useState(false);
  const [searchInput, setSearchInput] = useState('');

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

  // Boolean to track if there are currently notes
  const notesExist = notes.length > 0;
  // TESTING PURPOSES ONLY
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
            <div className={locals.inputSection}>
              {notesExist && (
                <div className={locals.searchNotes}>
                  <CarbonSearch
                    placeholder="Search notes and activity"
                    onChange={e => {
                      setSearchInput(e);
                    }}
                  />
                </div>
              )}
              {viewInputText ? (
                <TextInput
                  note={note}
                  user={user}
                  setNote={setNote}
                  incidentId={incidentId}
                  setViewInputText={setViewInputText}
                />
              ) : (
                <QuickActions setViewInputText={setViewInputText} />
              )}
            </div>
            <CommentList notes={filteredNotes} preferredName={user.preferredName} />
          </>
        )}
      </div>
    </CarbonLayer>
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
          const type = note.type;
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
                <div className={locals.chatEntryInfo}>{noteNameAndTimeFormat(myBubble, note, date, type)}</div>
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

// Handle the note submission
// Requires the incidentID, note, user, and setNote function
// Dont allow the annotateEvent call if note is empty
// Once you submit the event clear the note value with SetNote
export function handleSubmitNote(incidentId, note, user, setNote, setViewInputText) {
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
    setViewInputText(false);
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

// Basic empty state for notes
export function EmptyState() {
  return (
    <div className={locals.emptyWrapper}>
      <h3 className={locals.emptyHeader}>{t('in-events:notes.noNotes')}</h3>
      <p className={locals.emptyInfo}>{t('in-events:notes.noNotesDetails')}</p>
    </div>
  );
}

// Handle the view where inputting a note occurs
// Carbon Text Area
// Two Carbon Buttons
export function TextInput(props) {
  const { note, user, setNote, incidentId, setViewInputText } = props;
  return (
    <>
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
      <div className={locals.noteButtonWrapper}>
        <CarbonButton
          onClick={() => {
            setViewInputText(false);
          }}
          kind="secondary"
          className={locals.addNoteButton}
          size={'md'}
        >
          {t('in-events:notes.cancel')}
        </CarbonButton>
      </div>
      <div className={locals.noteButtonWrapper}>
        <CarbonButton
          onClick={() => {
            handleSubmitNote(incidentId, note, user, setNote, setViewInputText, setViewInputText);
          }}
          className={locals.addNoteButton}
          size={'md'}
        >
          {t('in-events:notes.addNote')}
        </CarbonButton>
      </div>
    </>
  );
}

// Main view that gives an overview for this side panel
// Gives the user the options to add a note or generate a summary
export function QuickActions(props) {
  const { setViewInputText } = props;
  return (
    <>
      <div className={locals.quickActionsHeader}>{t('in-events:notes.quickActions')}</div>
      <div className={locals.quickActionsDescription}>{t('in-events:notes.quickActionsDescription')}</div>
      <div className={locals.quickActionButtonWrapper}>
        <CarbonButton kind={'tertiary'} className={locals.actionsButton} size={'sm'}>
          <div className={locals.quickActionButtonContents}>
            {t('in-events:notes.generateSummary')}
            <SvgIcon type="lib_infra_ai" />
          </div>
        </CarbonButton>
      </div>
      <CarbonButton
        kind={'tertiary'}
        className={locals.actionsButton}
        size={'sm'}
        onClick={() => {
          setViewInputText(true);
        }}
      >
        <div className={locals.quickActionButtonContents}>
          {t('in-events:notes.addComment')}
          <SvgIcon type="lib_actions_comment" />
        </div>
      </CarbonButton>
    </>
  );
}
