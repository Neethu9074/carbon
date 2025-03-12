/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import {
  SvgIcon,
  CarbonButton,
  CarbonIconButton,
  CarbonInlineLoading,
  Typography,
  Stack,
  IconButton
} from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  EVENT_AI_SHOW_MORE_INCIDENTS,
  EVENT_AI_SHOW_MORE_ACTIONS,
  EVENT_AI_SHARE_OPENED,
  EVENT_AI_RUN_ACTION,
  NOTES_SUMMARY_FEEDBACK_NEGATIVE,
  NOTES_SUMMARY_FEEDBACK_POSITIVE
} from 'in-services/tracking/eventNames';
import {
  convertIncidentSummaryToString,
  convertActionsToString,
  convertNotesSummaryToString
} from 'in-events/components/NotesAndActivity/components/NoteTypes/utils';
import { handleTracking } from 'in-events/components/NotesAndActivity/components/utils';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useAction from 'in-automation/ActionCatalog/useAction';
import { eventsPath } from 'in-events/navigation/paths';
import { t } from 'in-i18n';

import locals from './AISummary.mless';

/**
 * Handle the AI Summary type of note entry.  For the AI summary we want to
 * display its data a certain format.
 *
 * @param {Object} noteObj - The note object containing data for summarization.
 * @param {Function} setNeedOverlay - Function to set the need for an overlay.
 * @param {Function} setShareOpen - Function to set the share button open state.
 * @param {Function} setSummaryData - Function to set the summary data for sharing.
 * @param {Object} event - The event object.
 * @returns {JSX.Element} - The JSX element for the AISummary component.
 */
export function AISummary({ noteObj, setNeedOverlay, setShareOpen, setSummaryData, event }) {
  // Show alls that handle showing more incidents / Actions
  const [showAllIncidents, setShowAllIncidents] = useState(false);
  const [showAllActions, setShowAllActions] = useState(false);

  // Little Slice function for grabbing the first 5 entries for incidents / actions
  const subArray = (arr, i = 0, n = 1) => arr?.slice(i, n);

  // Calculate the first 5 and last values for incidents / actions
  // These are used to determine if their show more buttons should be visible
  const relatedEventSummary = noteObj?.data?.get('watsonxSummary')?.get('recentEventsSummary') || [];
  const firstFiveRelated = subArray(relatedEventSummary, 0, 5);
  const lastRelated = subArray(relatedEventSummary, 5, relatedEventSummary.size);
  const actionHistory = noteObj?.data?.get('actionHistorySummary') || [];
  const firstFiveAction = subArray(actionHistory, 0, 5);
  const lastAction = subArray(actionHistory, 5, actionHistory.size);
  // Only one entry so dont need show more
  const notesSummaryData = noteObj?.data?.get('watsonxSummary')?.get('notesSummary') || [];
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
        <NotesEntry notesList={notesSummaryData} />
      </div>

      {/* Summarization of Actions to take */}
      <div className={locals.summarySection}>
        <div className={locals.contentsHeader}>{t('in-events:notes.sumActions')}</div>
        <ActionEntry actionList={firstFiveAction} noteId={noteObj?.id} event={event} />
        {showAllActions && <ActionEntry actionList={lastAction} event={event} />}
        {lastAction.size > 0 && (
          <ShowAllButton
            setShowAllType={setShowAllActions}
            showAllValue={showAllActions}
            trackingType={EVENT_AI_SHOW_MORE_ACTIONS}
            noteId={noteObj?.id}
          />
        )}
      </div>

      <div className={locals.shareCopyWrapper}>
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
      <SummaryFeedbackComponent noteObj={noteObj} />
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
              <div className={locals.bold}>{entityLabel}</div>
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
        return <div>{entity}</div>;
      })}
    </>
  );
}

// Function to reduce duplicate code for looping through action history bullet points
export function ActionEntry({ actionList, noteId, event }) {
  const noActions = actionList.size == 0;

  const triggeringEvent = event?.get('triggeringEvent') || '';
  // Action Dialog needs the event to reference just the id so we can make that
  // from the triggering event
  const eventObjId = { id: triggeringEvent };
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
              <div className={locals.bold}>{`${actionName}`}</div>
              {`type: ${actionType}`}
            </div>
            <ActionHistoryButton actionId={actionId} noteId={noteId} eventObjId={eventObjId} />
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
function ActionHistoryButton({ actionId, noteId, eventObjId }) {
  // API call to get the action object which contains the field params
  // which is needed to pass to the RunActionDialog
  const actionResult = useAction({ id: actionId, isCopy: false });
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
            handleRunActionClick(actionResult, noteId, eventObjId);
          }}
        >
          <SvgIcon type="lib_actions_play" size="xs" />
        </CarbonIconButton>
      )}
    </>
  );
}

// Show all button is used in order to display extended content
// This function simply controls the button and its passed in values
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

function handleRunActionClick(action, noteId, eventObjId) {
  if (action.data && action.progress.loading == false) {
    handleTracking(noteId, EVENT_AI_RUN_ACTION);
    addActiveDialog(<RunActionDialog action={action.data} volatileId={{}} event={eventObjId} />);
  }
}

// Copy text to clipboard
function copyToClipboard(str) {
  navigator.clipboard.writeText(str);
}

//Modified from EventTable FeedbackComponents
function SummaryFeedbackComponent({ noteObj, textVariant = 'body-regular', iconSize = 's' }) {
  const { trackCta } = useSegmentTracking();
  const tup = 'thumbsUp';
  const tdown = 'thumbsDown';
  const [feedbackState, setFeedbackState] = useState('');
  const { location } = useNavigation();

  return (
    <Stack direction="horizontal" gap="xxsmall" distribution="start" align="center">
      <Typography variant={textVariant} align="center">
        {feedbackState === '' ? t('in-events:summaryHelpfulText') : t('in-events:thankYouForYourFeedback')}
      </Typography>

      <Stack direction="horizontal" align="center" gap="xxsmall">
        <IconButton
          kind="subtle"
          // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
          //TODO: Find an alternative to this (i.e. bring in a filled in thumbs up icon)
          color={feedbackState === tup ? themes.default.ids.color.option.neutral['300'] : undefined}
          size="compact"
          type="lib_thumbs_up"
          iconSize={iconSize}
          onClick={() => {
            const summaryFeedbackObject = {
              summaryID: noteObj.id,
              eventID: location.matrix[eventsPath]?.eventId
            };
            trackCta(NOTES_SUMMARY_FEEDBACK_POSITIVE, summaryFeedbackObject);
            if (feedbackState === tup) {
              setFeedbackState('');
            } else {
              setFeedbackState(tup);
            }
          }}
        />
        <IconButton
          kind="subtle"
          // I acknowledge this isn't ideal but we will release a preliminary version and a discussion will take place to find a new way to do this
          //TODO: Find an alternative to this (i.e. bring in a filled in thumbs down icon)
          color={feedbackState === tdown ? themes.default.ids.color.option.neutral['300'] : undefined}
          size="compact"
          iconSize={iconSize}
          type="lib_thumbs_down"
          onClick={() => {
            const summaryFeedbackObject = {
              summaryID: noteObj.id,
              eventID: location.matrix[eventsPath]?.eventId
            };
            trackCta(NOTES_SUMMARY_FEEDBACK_NEGATIVE, summaryFeedbackObject);
            if (feedbackState === tdown) {
              setFeedbackState('');
            } else {
              setFeedbackState(tdown);
            }
          }}
        />
      </Stack>
    </Stack>
  );
}
