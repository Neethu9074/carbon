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
  CarbonIconButton,
  CarbonInlineLoading
} from '@instana/components';

import {
  noteNameAndTimeFormat,
  createDataString,
  convertSummaryToString,
  convertActionsToString,
  convertNotesSummaryToString,
  handleTracking
} from './utils';
import { EVENT_AI_SHOW_MORE, EVENT_AI_SHARE_OPENED } from 'in-services/tracking/eventNames';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { TYPE_NOTE, TYPE_EXT_NOTE, TYPE_EXT_F_CHANGE, TYPE_AI_SUMMARY } from '../utils';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { dateFormat, timeFormat } from 'in-services/formatters/date';
import useAction from 'in-automation/ActionCatalog/useAction';
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
                event={event}
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
  setSummaryData,
  event
}) {
  // Action history test data
  const actionHistory = {
    actionHistory: [
      // {
      //   name: 'Kubernetes Cron Job Status',
      //   type: 'ANSIBLE'
      // },
      // {
      //   name: 'Run status CPU clear',
      //   type: 'HTTP'
      // },
      // {
      //   name: 'Kubernetes Cron Job Status2',
      //   type: 'ANSIBLE'
      // },
      // {
      //   name: 'Run status CPU clear2',
      //   type: 'HTTP'
      // },
      // {
      //   name: 'Kubernetes Cron Job Status3',
      //   type: 'ANSIBLE'
      // },
      // {
      //   name: 'Run status CPU clear3',
      //   type: 'HTTP'
      // }
    ]
  };
  // Test data for notes Summary
  const notesSummaryData = [
    // '1. Restarted the pod as a temporary measure.',
    // '2. This incident has been previously reported and is being handled as a duplicate.',
    // "3. No action required from the user's side.",
    // '4. The previous incident was likely due to high error rates in the GET endpoint.',
    // '5. The team needs to investigate the root cause of the persistent failure of the GET endpoint.',
    // '6. Josh added this to test the show more button.'
  ];

  // Show alls that handle showing more incidents / Notes / Actions
  const [showAllIncidents, setShowAllIncidents] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);

  // Currently we have 4 types of bubbles
  const note = type === TYPE_NOTE;
  const extNote = type === TYPE_EXT_NOTE;
  const extChange = type === TYPE_EXT_F_CHANGE;
  const updatedBy = (extChange && noteObj?.metadata?.get('updatedBy')) || '';
  const aiSum = type === TYPE_AI_SUMMARY;

  // Little Slice function for grabbing the first 5 entries for incidents / notes / actions
  const subArray = (arr, i = 0, n = 1) => arr?.slice(i, n);

  // Calculate the first 5 and last values for incidents / notes / actions
  // These are used to determine if their show more buttons should be visible
  const sumData = noteObj?.data || [];
  const firstFive = aiSum && subArray(sumData, 0, 5);
  const last = aiSum && subArray(sumData, 5, sumData.size);
  const firstFiveNotesSum = aiSum && subArray(notesSummaryData, 0, 5);
  const lastNotesSum = aiSum && subArray(notesSummaryData, 5, notesSummaryData.length);
  const firstFiveActionSum = aiSum && subArray(actionHistory.actionHistory, 0, 5);
  const lastActionSum = aiSum && subArray(actionHistory.actionHistory, 5, actionHistory.actionHistory.length);
  // The full summarization that includes incident, notes, and action summary
  // Used for copy and share button
  const incidentSummary = aiSum && convertSummaryToString(sumData);
  const notesSummary = aiSum && convertNotesSummaryToString(notesSummaryData);
  const actionHistorySummary = aiSum && convertActionsToString(actionHistory.actionHistory);
  const fullSummaryText = aiSum && `${incidentSummary}${notesSummary}\n${actionHistorySummary}`;

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

            {/* Summarization of incident */}
            <SummaryEntry summaryList={firstFive} />
            {showAllIncidents && <SummaryEntry summaryList={last} />}
            {last.size > 0 && (
              <ShowAllButton
                setShowAllType={setShowAllIncidents}
                showAllValue={showAllIncidents}
                trackingType={EVENT_AI_SHOW_MORE}
                noteId={noteObj?.id}
              />
            )}

            {/* Summarization of notes */}
            <div style={{ paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '.5rem' }} className={locals.bubbleContentsHeader}>
                {t('in-events:notes.sumNotes')}
              </div>
              <NotesEntry notesList={firstFiveNotesSum} />
              {showAllNotes && <NotesEntry notesList={lastNotesSum} />}
              {lastNotesSum.length > 0 && (
                <ShowAllButton
                  setShowAllType={setShowAllNotes}
                  showAllValue={showAllNotes}
                  trackingType={EVENT_AI_SHOW_MORE}
                  noteId={noteObj?.id}
                />
              )}
            </div>

            {/* Summarization of Actions to take */}
            <div style={{ paddingTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '.5rem' }} className={locals.bubbleContentsHeader}>
                {t('in-events:notes.sumActions')}
              </div>
              <ActionEntry actionList={firstFiveActionSum} event={event} />
              {showAllActions && <ActionEntry actionList={lastActionSum} event={event} />}
              {lastActionSum.length > 0 && (
                <ShowAllButton
                  setShowAllType={setShowAllActions}
                  showAllValue={showAllActions}
                  trackingType={EVENT_AI_SHOW_MORE}
                  noteId={noteObj?.id}
                />
              )}
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
                  setSummaryData(fullSummaryText);
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
                  copyToClipboard(fullSummaryText);
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
        const props = Object.fromEntries(entity);
        const entityLabel = (props.entityLabel && props.entityLabel !== '' && props.entityLabel) || props.entityName;
        const entitySummary = `${props.entitySummary}\n`;
        return (
          <div key={entityLabel} className={locals.summaryList}>
            {`-`}
            <div>
              <div style={{ fontWeight: '700' }}>{entityLabel}</div>
              {entitySummary}
            </div>
          </div>
        );
      })}
    </>
  );
}

// Function to reduce duplicate code for looping through notes summary
function NotesEntry({ notesList }) {
  const noNotes = notesList.length == 0;
  return (
    <>
      {noNotes && t('in-events:notes.noSumNotes')}
      {notesList.map(entity => {
        return (
          <div key={entity} className={locals.summaryList}>
            {`-`}
            <div>{entity}</div>
          </div>
        );
      })}
    </>
  );
}

// Function to reduce duplicate code for looping through action history bullet points
function ActionEntry({ actionList, event }) {
  const actionIDtesting = '64a495b6-8680-4049-89c2-1aea9ed3c180';
  // const actionIDtesting = 'badid';
  const noActions = actionList.length == 0;
  return (
    <>
      {noActions && t('in-events:notes.noSumActions')}
      {actionList.map(entity => {
        return (
          <div key={entity.name} className={locals.summaryList}>
            {`-`}
            <div>
              <div style={{ fontWeight: '700' }}>{`${entity.name}`}</div>
              {`type: ${entity.type}`}
            </div>
            <ActionHistoryButton actionId={actionIDtesting} event={event} />
          </div>
        );
      })}
    </>
  );
}

// Action History Button
// This function will make an API call when actionID is passed in
// When its loading a spinner will be displayed, otherwise button
// can be clicked
function ActionHistoryButton({ actionId, event }) {
  // const testAction = {
  //   'createdAt': 1710635670.462481,
  //   // 'id': "33038086-1b14-3a25-8588-0f9e48943f17",
  //   'id': "64a495b6-8680-4049-89c2-1aea9ed3c180",
  //   'modifiedAt': 1730981279.138593,
  //   'name': "Get iNodes Usage Info on host",
  //   'type': "ANSIBLE",
  //   'fields': [
  //     {'name': 'playbookId','description': 'The playbook ID', 'encoding': 'ascii', 'value': '45', 'secured': false},
  //     {'name': 'playbookFileName', 'description': 'The playbook filename', 'encoding': 'ascii', 'value': 'ansible/host/hostiNodesDebug.yaml', 'secured': false},
  //     {'name': 'ansibleUrl', 'description': 'The ansible url', 'encoding': 'ascii', 'value': 'https://9.66.244.190', 'secured': false},
  //     {'name': 'ansibleUrl', 'description': 'The ansible url', 'encoding': 'ascii', 'value': 'https://9.66.244.190', 'secured': false}
  //   ],
  //   'metadata': {'readOnly': false, 'builtIn': false, 'sensorImported': true, 'aiOriginated': false, 'ai': null}
  // }
  // API call to get the action object which contains the field params
  // which is needed to pass to the RunActionDialog
  const actionResult = useAction(actionId, false);
  const isLoading = actionResult && actionResult?.progress?.loading;
  const hasErrors = actionResult && actionResult?.errors.length > 0;
  return (
    <>
      {isLoading && <CarbonInlineLoading />}
      {hasErrors && <CarbonInlineLoading status="error" />}
      {!isLoading && !hasErrors && (
        <CarbonIconButton
          kind={'ghost'}
          size={'sm'}
          align={'left'}
          label={t('in-automation:ActionCatalog.run')}
          onClick={() => {
            handleRunActionClick(actionResult, event);
          }}
        >
          <SvgIcon type="lib_actions_play" size="xs" />
        </CarbonIconButton>
      )}
    </>
  );
}

function ShowAllButton({ setShowAllType, showAllValue, trackingType, noteId }) {
  return (
    <CarbonButton
      size="sm"
      onClick={() => {
        handleTracking(noteId, trackingType);
        setShowAllType(!showAllValue);
      }}
      kind="ghost"
    >
      {!showAllValue ? t('in-events:notes.showAll') : t('in-events:notes.collapse')}
    </CarbonButton>
  );
}

function handleRunActionClick(action, event) {
  if (action.data && action.progress.loading == false) {
    // handleTracking(incidentId, EVENT_AI_SHARE_SUBMIT);
    addActiveDialog(
      <RunActionDialog
        action={action.data}
        /*executePolicy={policy}*/ volatileId={{}}
        event={Object.fromEntries(event)}
      />
    );
  }
}

function copyToClipboard(str) {
  navigator.clipboard.writeText(str);
}
