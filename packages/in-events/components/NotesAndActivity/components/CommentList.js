/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';

import { SvgIcon, CarbonOverflowMenu, CarbonOverflowMenuItem } from '@instana/components';

import {
  TYPE_NOTE,
  TYPE_EXT_NOTE,
  TYPE_EXT_F_CHANGE,
  TYPE_AI_SUMMARY
} from 'in-events/components/NotesAndActivity/utils';
import { noteNameAndTimeFormat, createDataString } from 'in-events/components/NotesAndActivity/components/utils';
import { AISummary, WatsonAIAvatar } from 'in-events/components/NotesAndActivity/components/NoteTypes/AISummary';
import { ExternalNote } from 'in-events/components/NotesAndActivity/components/NoteTypes/ExternalNote';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './CommentList.mless';

/**
 * @param {Array} notes - An array of notes to display in the CommentList.
 * @param {Function} setDisplayQuickStart - A function to set the displayQuickStart state.
 * @param {boolean} displayQuickStart - The current displayQuickStart state.
 * @param {Function} setNote - A function to set the note state.
 * @param {Function} setEditNoteId - A function to set the editNoteId state.
 * @param {Function} setNeedOverlay - A function to set the needOverlay state.
 * @param {Function} setShareOpen - A function to set the shareOpen state.
 * @param {Function} setSummaryData - A function to set the summaryData state.
 * @param {Object} event - The event object.
 * @returns {JSX.Element} - The JSX element for the CommentList component.
 *
 * This is the main container for the chat bubbles where we catch the notes types
 * and then format them accordingly
 */
export function CommentList({
  notes,
  setDisplayQuickStart,
  displayQuickStart,
  setNote,
  setEditNoteId,
  setNeedOverlay,
  setShareOpen,
  setSummaryData,
  event
}) {
  // This adds in the scroll wheel event listener to determine the percentage
  // of the scroll height so we know if we need to collapse and expand the quick actions
  useEffect(() => {
    if (notes) {
      const noteSection = document.getElementById('notesSection');
      // Event listener is cleaned up automatically when the side panel is closed
      // because the `notesSection` dom element gets removed
      noteSection.addEventListener('scroll', event => {
        const scrollHeight = event?.target?.scrollHeight;
        const scrollTop = event?.target?.scrollTop;
        const clientHeight = event?.target?.clientHeight;
        const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * -100);
        // We only want to allow the transitional effects whenever the scroll
        // difference is greater than 200.
        const difference = scrollHeight - clientHeight;
        // If we scroll up 50% then collapse the quick actions
        if (percentage > 50 && displayQuickStart && difference > 200) {
          setDisplayQuickStart(false);
        } else if (percentage < 10 && !displayQuickStart && difference > 130) {
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
          const myBubble = note.authorId == user.id;
          const type = note.type;
          const aiSum = type === TYPE_AI_SUMMARY;
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          const isEdited = note?.updated && note?.updated != 0;
          // Display the icon if its not my chat message
          // Dont show for AI Summary because we display a different component
          const displayIcon = !myBubble && !aiSum;
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                <EntryIcon displayIcon={displayIcon} note={note} />
                <div
                  className={classNames({
                    [locals.myChatEntryInfo]: true,
                    [locals.chatEntryInfo]: displayIcon
                  })}
                >
                  {noteNameAndTimeFormat(myBubble, note, date, type, isEdited)}
                </div>
              </div>
              <ChatBubble
                noteObj={note}
                contents={note.contents}
                data={note?.data}
                myBubble={myBubble}
                type={type}
                setEditNoteId={setEditNoteId}
                setNeedOverlay={setNeedOverlay}
                setNote={setNote}
                setShareOpen={setShareOpen}
                setSummaryData={setSummaryData}
                event={event}
              />
            </div>
          );
        })}
    </div>
  );
}

// Handle which icon should be rendered for each note entry
export function EntryIcon({ note = {}, displayIcon }) {
  const aiSum = note.type === TYPE_AI_SUMMARY;
  const serviceNow = note.origin === 'ServiceNow';
  const slack = note.origin === 'Slack';
  const iconType = (slack && 'lib_slack_icon') || (serviceNow && 'lib_snow_icon') || 'lib_actions_user';
  const iconSize = (!serviceNow && 'xs') || 'sm';
  const iconViewBox = (serviceNow && '0 0 24 24') || (slack && '4 4 24 24') || '0 0 16 16';
  return (
    <>
      {displayIcon && !aiSum && (
        <SvgIcon
          type={iconType}
          size={iconSize}
          viewBox={iconViewBox}
          className={classNames({
            [locals.userIcon]: !aiSum && !serviceNow && !slack,
            [locals.snowIcon]: serviceNow,
            [locals.aiIcon]: aiSum && !serviceNow
          })}
        />
      )}
      {aiSum && <WatsonAIAvatar />}
    </>
  );
}

// Individual chat bubble that has differing colors and stylings based on
// if the text is from me or someone else, ai generated, or external source
export function ChatBubble({
  myBubble,
  contents,
  data,
  type,
  noteObj,
  setNote,
  setEditNoteId,
  setNeedOverlay,
  setShareOpen,
  setSummaryData,
  event
}) {
  // Currently we have 4 types of bubbles
  const note = type === TYPE_NOTE;
  const extNote = type === TYPE_EXT_NOTE;
  const extChange = type === TYPE_EXT_F_CHANGE;
  const updatedBy = (extChange && noteObj?.metadata?.get('updatedBy')) || '';
  const aiSum = type === TYPE_AI_SUMMARY;

  return (
    <>
      {/* Show the overflow menu to edit and delete an note IF its the current users personal message */}
      {myBubble && note && (
        <EditDeleteOverflowMenu
          setNote={setNote}
          setEditNoteId={setEditNoteId}
          setNeedOverlay={setNeedOverlay}
          noteId={noteObj?.id}
          contents={contents}
        />
      )}
      <div
        className={classNames({
          [locals.myBubble]: myBubble && note,
          [locals.ext]: extNote || extChange || (!myBubble && note),
          [locals.bubble]: true,
          [locals.aiGenBubble]: aiSum
        })}
      >
        {/* General Note Written by any user */}
        {note && contents && (
          <div
            className={classNames({
              [locals.wordWrap]: true,
              [locals.spaceForEditDelete]: myBubble
            })}
          >
            {contents}
          </div>
        )}
        {/* AI Summarization */}
        {aiSum && (
          <AISummary
            noteObj={noteObj}
            setNeedOverlay={setNeedOverlay}
            setShareOpen={setShareOpen}
            setSummaryData={setSummaryData}
            event={event}
          />
        )}
        {/* External Note */}
        {extNote && <ExternalNote noteObj={noteObj} />}
        {/* External Activity Change */}
        {extChange && (
          <>
            <div className={locals.bubbleContentsHeader}>
              {noteObj?.label}
              <div style={{ fontWeight: 400 }}>{t('in-events:notes.updatedBy', { name: updatedBy })}</div>
            </div>
            {createDataString(data, updatedBy)}
          </>
        )}
      </div>
    </>
  );
}

// The overflow menu that helps with editing and deleting a users note
export function EditDeleteOverflowMenu({ setNote, setEditNoteId, setNeedOverlay, noteId, contents }) {
  return (
    <div className={locals.menuWrapper}>
      <CarbonOverflowMenu size="sm" align="left" flipped menuOptionsClass={locals.highIndex}>
        <CarbonOverflowMenuItem
          itemText={t('in-events:notes.edit')}
          onClick={() => {
            setNote(contents);
            setEditNoteId([noteId, true]);
          }}
        />
        <CarbonOverflowMenuItem
          itemText={t('in-events:notes.delete')}
          isDelete
          onClick={() => {
            setNote('');
            setNeedOverlay(true);
            setEditNoteId([noteId, false]);
          }}
        />
      </CarbonOverflowMenu>
    </div>
  );
}
