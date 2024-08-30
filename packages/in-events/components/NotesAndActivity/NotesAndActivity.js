/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
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
  // Flag determines if the customer has "generate summary" capability
  const aiFlagEnabled = true;
  const { event, displayNotes, setDisplayNotes } = props;
  // Extract the notes from the event
  const notes = getNotes(event);
  const incidentId = event?.get('id');
  const eventType = event?.get('type');

  const loading = event == undefined;

  // Boolean to control when the notes section is opened
  // Current value of the typed out note
  const [note, setNote] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [displayQuickStart, setDisplayQuickStart] = useState(true);

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
  // notes.push({
  //   type: 'external_note',
  //   id: 'note-123fddf45',
  //   parent: 'vQ9n1JcfTXKZC-5DsY_74Q',
  //   timestamp: 1692892800000,
  //   updated: 0,
  //   author: 'Jaydon Blue',
  //   metadata: {
  //     apiToken: 'iid-valid-api-token',
  //     createdBy: 'Jaydon Blue',
  //     priority: 'High',
  //     userId: null
  //   },
  //   origin: 'ServiceNow',
  //   internal: true,
  //   label: 'Work Notes',
  //   contents: 'This is an internal note regarding the issue.'
  // });
  // notes.push({
  //   type: 'ai_generated',
  //   id: 'QNxHdd2JGRWG5OayzLX3dgadfadsfadsg',
  //   parent: 'SIqsdfetSR2mFBzafaqKNVy1GQ',
  //   timestamp: 1722957105978,
  //   updated: 0,
  //   author: 'Denton Zan',
  //   metadata: {},
  //   contents:
  //     'traffic related problem(s) has been observed, which is: The system has encountered an error rate that is at least 0% and as high as 500%, specifically with status code 442 and 500, indicating a significant server-side issue.'
  // });
  // notes.push({
  //   author: 'Steve Sarkisian',
  //   contents: "Hey this is Coach Sark! Just wanted to let you know I'm looking into this incident!",
  //   id: 'a8s9d0fuds89afjds9af',
  //   parent: 'aklsdfjasfjasdfdas',
  //   timestamp: 1724956897828,
  //   type: 'note',
  //   updated: 0
  // });
  // notes.push({
  //   type: 'external_note',
  //   id: 'QNxaHX2JGRWG5OayzLX3dgg',
  //   parent: 'SIqmHetSR2mFBzqKNVy1GQ',
  //   timestamp: 1722957105978,
  //   updated: 0,
  //   author: 'Quinn Ewers',
  //   metadata: {},
  //   origin: 'ServiceNow',
  //   internal: false,
  //   label: 'Additional comments',
  //   contents: 'This is an external_note that has been brought to you by.... SERVICE NOW!'
  // });
  // notes.push({
  //   type: 'external_field_change',
  //   id: 'QNxHX2JGRWG5OayzLX3ddgg',
  //   parent: 'SIqmHetSR2mFBzqKNVy1GQ',
  //   timestamp: 1722957105978,
  //   updated: 0,
  //   author: 'Denton Zan',
  //   metadata: {},
  //   origin: 'ServiceNow',
  //   label: 'Field changes',
  //   data: [
  //     ['Priority', '0', '1 - Critical'],
  //     ['Incident state', 'opened', 'In progress'],
  //     ['Opened by', '', 'ITIL User']
  //   ]
  // });
  // ^^^^^^^^^^^^^^^^^^^^^^^TESTING PURPOSES ONLY

  const filteredNotes = filterSearchNotes(notes, searchInput.toLowerCase());

  return (
    <CarbonLayer className={locals.notesHeaderWrapper}>
      <div className={locals.headerWrapper}>
        {t('in-events:notes.notesActivity')}
        <div className={locals.tagIconWrapper}>
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
                placeholder={t('in-events:notes.searchNotes')}
                onChange={e => {
                  setSearchInput(e?.target?.value);
                }}
              />
            )}
            <QuickActions aiFlagEnabled={aiFlagEnabled} displayQuickStart={displayQuickStart} />
            <CommentList
              notes={filteredNotes}
              preferredName={user.preferredName}
              displayQuickStart={displayQuickStart}
              setDisplayQuickStart={setDisplayQuickStart}
            />
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

export function CommentList(props) {
  const { notes, preferredName, setDisplayQuickStart, displayQuickStart } = props;

  // This adds in the scroll wheel event listener to determine the percentage
  // of the scroll height so we know if we need to collapse and expand the quick actions
  useEffect(() => {
    if (notes) {
      const noteSection = document.getElementById('notesSection');
      noteSection.addEventListener('scroll', event => {
        const scrollHeight = event?.target?.scrollHeight;
        const scrollTop = event?.target?.scrollTop;
        const clientHeight = event?.target?.clientHeight;
        const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * -100);
        // If we scroll up 50% then collapse the quick actions
        if (percentage > 50 && displayQuickStart) {
          setDisplayQuickStart(false);
        } else if (percentage < 10 && !displayQuickStart) {
          setDisplayQuickStart(true);
        }
      });
    }
  }, [notes, displayQuickStart, setDisplayQuickStart]);

  return (
    <div
      className={classNames({
        [locals.notesSection]: true
      })}
      id="notesSection"
      tabIndex={'-1'}
    >
      {notes &&
        notes.map((entry, i) => {
          // Using i to iterate helps us traverse backwards that way notes are displayed
          // with the newest note at the top, oldest at the bottom
          const note = notes[notes.length - i - 1];
          const myBubble = note.author == preferredName;
          const type = note.type;
          const aiGen = type === 'ai_generated';
          const serviceNow = note.origin === 'ServiceNow';
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          const iconType =
            (!aiGen && serviceNow && 'lib_snow_icon') ||
            (!aiGen && !serviceNow && 'lib_user_avatar_filled_alt') ||
            'lib_ai_slug';
          const iconSize = (aiGen && 'regular') || 'sm';
          const iconViewBox = (serviceNow && '0 0 24 24') || (aiGen && '4 4 24 24') || '0 0 30 30';
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                {!myBubble && (
                  <SvgIcon
                    type={iconType}
                    size={iconSize}
                    viewBox={iconViewBox}
                    className={classNames({
                      [locals.userIcon]: !aiGen,
                      [locals.snowIcon]: serviceNow,
                      [locals.aiIcon]: aiGen && !serviceNow
                    })}
                  />
                )}
                <div
                  className={classNames({
                    [locals.chatEntryInfo]: !myBubble,
                    [locals.myChatEntryInfo]: myBubble
                  })}
                >
                  {noteNameAndTimeFormat(myBubble, note, date, type)}
                  {aiGen && (
                    <SvgIcon type={'lib_ai_slug'} className={locals.aiIconSlug} size="xs" viewBox={'4 4 24 24'} />
                  )}
                </div>
              </div>
              <ChatBubble
                noteObj={note}
                contents={note.contents}
                data={note.data || note.metadata}
                myBubble={myBubble}
                type={type}
              />
            </div>
          );
        })}
    </div>
  );
}

// Individual chat bubble that has differing colors and stylings based on
// if the text is from me or someone else, ai generated, or external source
export function ChatBubble(props) {
  const { myBubble, contents, data, type, noteObj } = props;
  // Currently we have 4 types of bubbles
  const note = type === 'note';
  const extNote = type === 'external_note';
  const extChange = type === 'external_field_change';
  const aiGen = type === 'ai_generated';
  return (
    <div
      className={classNames({
        [locals.myBubble]: myBubble && note,
        [locals.ext]: extNote || extChange || (!myBubble && note),
        [locals.bubble]: true,
        [locals.aiGenBubble]: aiGen
      })}
    >
      {note && contents}
      {aiGen && (
        <>
          <div className={locals.bubbleContentsHeader}>{t('in-events:notes.sumGenerated')}</div>
          {contents}
        </>
      )}
      {extNote && (
        <>
          <div className={locals.bubbleContentsHeader}>{`${noteObj?.label}`}</div>
          {`${noteObj.author}: `}
          {contents}
        </>
      )}
      {extChange && (
        <>
          <div className={locals.bubbleContentsHeader}>{noteObj?.label}</div>
          {createDataString(data)}
        </>
      )}
    </div>
  );
}

// Main view that gives an overview for this side panel
// Gives the user the options to add a note or generate a summary
export function QuickActions(props) {
  const { aiFlagEnabled, displayQuickStart } = props;
  const header = (aiFlagEnabled && t('in-events:notes.summarizeIncident')) || t('in-events:notes.addNotesFor');
  const description =
    (aiFlagEnabled && t('in-events:notes.summarizeIncidentDescription')) || t('in-events:notes.tryAddingNotes');
  const summary = aiFlagEnabled && t('in-events:notes.generateSummary');
  const svgIconType = (aiFlagEnabled && 'lib_help_error_help_circle') || 'lib_actions_edit';
  return (
    <div
      className={classNames({
        [locals.quickActionWrapper]: true,
        [locals.extraPadding]: !displayQuickStart,
        [locals.transitionDown]: displayQuickStart
      })}
    >
      {displayQuickStart && <SvgIcon className={locals.questionIcon} type={svgIconType} />}

      <div>
        {displayQuickStart && (
          <>
            <div className={locals.quickActionsHeader}>{header}</div>
            <div className={locals.quickActionsDescription}>{description}</div>
          </>
        )}
        {aiFlagEnabled && (
          <CarbonButton
            kind={'tertiary'}
            className={locals.actionsButton}
            size={'sm'}
            renderIcon={() => <SvgIcon type="lib_generate_ai" color="currentColor" size="xs" />}
            // onClick={() => handleAIGenerateNote()}
          >
            <div className={locals.quickActionButtonContents}>{summary}</div>
          </CarbonButton>
        )}
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
