/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SvgIcon, CarbonButton, CarbonIconButton, CarbonInlineLoading } from '@instana/components';

import {
  EVENT_AI_SHOW_MORE_INCIDENTS,
  EVENT_AI_SHOW_MORE_NOTES,
  EVENT_AI_SHOW_MORE_ACTIONS,
  EVENT_AI_SHARE_OPENED,
  EVENT_AI_RUN_ACTION
} from 'in-services/tracking/eventNames';
import { convertIncidentSummaryToString, convertActionsToString, convertNotesSummaryToString } from './utils';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useAction from 'in-automation/ActionCatalog/useAction';
import { handleTracking } from '../utils';
import { t } from 'in-i18n';

import locals from './AISummary.mless';

export function AISummary({ noteObj, setNeedOverlay, setShareOpen, setSummaryData, event }) {
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

  // Little Slice function for grabbing the first 5 entries for incidents / notes / actions
  const subArray = (arr, i = 0, n = 1) => arr?.slice(i, n);

  // Calculate the first 5 and last values for incidents / notes / actions
  // These are used to determine if their show more buttons should be visible
  const relatedEventSummary = noteObj?.data?.get('relatedEventSummary') || [];
  const firstFiveRelated = subArray(relatedEventSummary, 0, 5);
  const lastRelated = subArray(relatedEventSummary, 5, relatedEventSummary.size);
  const firstFiveNotes = subArray(notesSummaryData, 0, 5);
  const lastNotes = subArray(notesSummaryData, 5, notesSummaryData.length);
  const actionHistory = noteObj?.data?.get('actionHistorySummary') || [];
  const firstFiveAction = subArray(actionHistory, 0, 5);
  const lastAction = subArray(actionHistory, 5, actionHistory.size);
  // The full summarization that includes incident, notes, and action summary
  // Used for copy and share button
  const incidentSummary = convertIncidentSummaryToString(relatedEventSummary);
  const notesSummary = convertNotesSummaryToString(notesSummaryData);
  const actionHistorySummary = convertActionsToString(actionHistory);
  const fullSummaryText = `${incidentSummary}${notesSummary}\n${actionHistorySummary}`;

  return (
    <>
      <div className={locals.contentsHeader}>{t('in-events:notes.sumGenerated')}</div>

      {/* Summarization of incident */}
      <SummaryEntry summaryList={firstFiveRelated} />
      {showAllIncidents && <SummaryEntry summaryList={lastRelated} />}
      {lastRelated.size > 0 && (
        <ShowAllButton
          setShowAllType={setShowAllIncidents}
          showAllValue={showAllIncidents}
          trackingType={EVENT_AI_SHOW_MORE_INCIDENTS}
          noteId={noteObj?.id}
        />
      )}

      {/* Summarization of notes */}
      <div className={locals.summarySection}>
        <div className={locals.contentsHeader}>{t('in-events:notes.sumNotes')}</div>
        <NotesEntry notesList={firstFiveNotes} />
        {showAllNotes && <NotesEntry notesList={lastNotes} />}
        {lastNotes.size > 0 && (
          <ShowAllButton
            setShowAllType={setShowAllNotes}
            showAllValue={showAllNotes}
            trackingType={EVENT_AI_SHOW_MORE_NOTES}
            noteId={noteObj?.id}
          />
        )}
      </div>

      {/* Summarization of Actions to take */}
      <div className={locals.summarySection}>
        <div className={locals.contentsHeader}>{t('in-events:notes.sumActions')}</div>
        <ActionEntry actionList={firstFiveAction} noteId={noteObj?.id} event={event} />
        {showAllActions && <ActionEntry actionList={lastAction} noteId={noteObj?.id} event={event} />}
        {lastAction.size > 0 && (
          <ShowAllButton
            setShowAllType={setShowAllActions}
            showAllValue={showAllActions}
            trackingType={EVENT_AI_SHOW_MORE_ACTIONS}
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
  );
}

// Function to reduce duplicate code for looping through summary bullet points
export function SummaryEntry({ summaryList }) {
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
export function NotesEntry({ notesList }) {
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
export function ActionEntry({ actionList, noteId, event }) {
  const noActions = actionList.size == 0;
  return (
    <>
      {noActions && t('in-events:notes.noSumActions')}
      {actionList.map(entity => {
        const props = Object.fromEntries(entity);
        const actionName = props.actionName;
        const actionId = props.actionId;
        const actionType = props.actionType;
        return (
          <div key={actionName} className={locals.summaryList}>
            {`-`}
            <div>
              <div style={{ fontWeight: '700' }}>{`${actionName}`}</div>
              {`type: ${actionType}`}
            </div>
            <ActionHistoryButton actionId={actionId} noteId={noteId} event={event} />
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
function ActionHistoryButton({ actionId, noteId, event }) {
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
            handleRunActionClick(actionResult, noteId, event);
          }}
        >
          <SvgIcon type="lib_actions_play" size="xs" />
        </CarbonIconButton>
      )}
    </>
  );
}

export function ShowAllButton({ setShowAllType, showAllValue, trackingType, noteId }) {
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

function handleRunActionClick(action, noteId, event) {
  if (action.data && action.progress.loading == false) {
    handleTracking(noteId, EVENT_AI_RUN_ACTION);
    addActiveDialog(<RunActionDialog action={action.data} volatileId={{}} event={Object.fromEntries(event)} />);
  }
}

function copyToClipboard(str) {
  navigator.clipboard.writeText(str);
}
