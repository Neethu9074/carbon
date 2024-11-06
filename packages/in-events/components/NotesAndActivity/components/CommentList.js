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
  CarbonOverflowMenu,
  CarbonOverflowMenuItem,
  CarbonIconButton
} from '@instana/components';

import {
  noteNameAndTimeFormat,
  createDataString,
  getSummary,
  convertSummaryToString,
  convertActionsToString,
  handleTracking
} from './utils';
import { EVENT_AI_SHOW_MORE, EVENT_AI_SHARE_OPENED } from 'in-services/tracking/eventNames';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { TYPE_NOTE, TYPE_EXT_NOTE, TYPE_EXT_F_CHANGE, TYPE_AI_SUMMARY } from '../utils';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './CommentList.mless';

export function CommentList({
  notes,
  setDisplayQuickStart,
  displayQuickStart,
  setNote,
  setEditNoteId,
  setNeedOverlay,
  setShareOpen,
  setSummaryData
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
          const serviceNow = note.origin === 'ServiceNow';
          const date = formatDateWithActiveLanguage(new Date(note.timestamp), `${dateFormat}, ${timeFormat}`);
          const isEdited = note?.updated && note?.updated != 0;
          const iconType =
            (!aiSum && serviceNow && 'lib_snow_icon') || (!aiSum && !serviceNow && 'lib_actions_user') || 'lib_ai_slug';
          const iconSize = (aiSum && 'regular') || (!aiSum && !serviceNow && 'xs') || 'sm';
          const iconViewBox = (serviceNow && '0 0 24 24') || (aiSum && '4 4 24 24') || '0 0 16 16';
          // Display the icon if its not my chat message OR if its AI Summary
          const displayIcon = !myBubble || aiSum;
          return (
            <div key={note.id}>
              <div
                className={classNames({
                  [locals.myChatEntry]: myBubble,
                  [locals.chatEntry]: true
                })}
              >
                {displayIcon && (
                  <SvgIcon
                    type={iconType}
                    size={iconSize}
                    viewBox={iconViewBox}
                    className={classNames({
                      [locals.userIcon]: !aiSum && !serviceNow,
                      [locals.snowIcon]: serviceNow,
                      [locals.aiIcon]: aiSum && !serviceNow
                    })}
                  />
                )}
                <div
                  className={classNames({
                    [locals.chatEntryInfo]: displayIcon,
                    [locals.myChatEntryInfo]: myBubble
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
              />
            </div>
          );
        })}
    </div>
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
  setSummaryData
}) {
  const [showAll, setShowAll] = useState(false);
  // Currently we have 4 types of bubbles
  const note = type === TYPE_NOTE;
  const extNote = type === TYPE_EXT_NOTE;
  const extChange = type === TYPE_EXT_F_CHANGE;
  const updatedBy = (extChange && noteObj?.metadata?.get('updatedBy')) || '';
  const aiSum = type === TYPE_AI_SUMMARY;
  // Calculate the AI Summary
  const sumData = noteObj?.data || [];
  const subArray = (arr, i = 0, n = 1) => arr?.slice(i, n);
  const firstFive = aiSum && subArray(sumData, 0, 5);
  const last = aiSum && subArray(sumData, 5, sumData.size);
  const summaryStart = aiSum && getSummary(firstFive);
  const summaryEnd = aiSum && getSummary(last);
  const summaryString = aiSum && convertSummaryToString(getSummary(sumData));
  // Action history test
  const actionHistory = {
    actionHistory: [
      {
        name: 'Kubernetes Cron Job Status',
        type: 'ANSIBLE'
      },
      {
        name: 'Run status CPU clear',
        type: 'HTTP'
      }
    ]
  };

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
          <>
            <div className={locals.bubbleContentsHeader}>{t('in-events:notes.sumGenerated')}</div>
            <SummaryEntry summaryList={summaryStart} />
            {showAll && <SummaryEntry summaryList={summaryEnd} />}
            {/* Show all button */}
            {summaryEnd.length > 0 && (
              <CarbonButton
                size="sm"
                onClick={() => {
                  handleTracking(noteObj?.id, EVENT_AI_SHOW_MORE);
                  setShowAll(!showAll);
                }}
                kind="ghost"
              >
                {!showAll ? t('in-events:notes.showAll') : t('in-events:notes.collapse')}
              </CarbonButton>
            )}
            <div style={{ paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '.5rem' }} className={locals.bubbleContentsHeader}>
                {'Actions taken for similar incidents:'}
              </div>
              <ActionEntry actionList={actionHistory.actionHistory} />
            </div>

            <div style={{ display: 'flex', paddingTop: '.5rem' }}>
              {/* Share summarization button */}
              <CarbonIconButton
                kind={'ghost'}
                size={'sm'}
                label={t('in-events:notes.share')}
                onClick={() => {
                  setNeedOverlay(true);
                  setShareOpen(true);
                  setSummaryData(`${summaryString}${convertActionsToString(actionHistory.actionHistory)}`);
                  handleTracking(noteObj?.id, EVENT_AI_SHARE_OPENED);
                }}
              >
                <SvgIcon type="lib_actions_share" size="xs" />
              </CarbonIconButton>
              {/* Copy summarization button */}
              <CarbonIconButton
                kind={'ghost'}
                size={'sm'}
                label={t('in-events:notes.copy')}
                onClick={() => {
                  copyToClipboard(`${summaryString}${convertActionsToString(actionHistory.actionHistory)}`);
                }}
              >
                <SvgIcon type="lib_actions_copy" size="xs" />
              </CarbonIconButton>
            </div>
          </>
        )}
        {/* External Note */}
        {extNote && (
          <>
            <div className={locals.bubbleContentsHeader}>{`${noteObj?.label}`}</div>
            {`${noteObj.author}: `}
            <div style={{ wordWrap: 'break-word' }}>{contents}</div>
          </>
        )}
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
      <CarbonOverflowMenu size="sm" align="left" flipped>
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

// Function to reduce duplicate code for looping through summary bullet points
function SummaryEntry({ summaryList }) {
  return (
    <>
      {summaryList.map(entity => {
        return (
          <div key={entity.label} className={locals.summaryList}>
            {`- `}
            <div>
              <div style={{ fontWeight: '700' }}>{entity.label}</div>
              {entity.summary}
            </div>
          </div>
        );
      })}
    </>
  );
}

// Function to reduce duplicate code for looping through action history bullet points
function ActionEntry({ actionList }) {
  return (
    <>
      {actionList.map(entity => {
        return (
          <div key={entity.name} className={locals.summaryList}>
            {`- `}
            <div>
              <div style={{ fontWeight: '700' }}>{`${entity.name}`}</div>
              {`type: ${entity.type}`}
            </div>
          </div>
        );
      })}
    </>
  );
}

function copyToClipboard(str) {
  navigator.clipboard.writeText(str);
}
