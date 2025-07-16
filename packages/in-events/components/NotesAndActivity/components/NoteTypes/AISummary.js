/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ThumbsUp, ThumbsDown, ThumbsUpFilled, ThumbsDownFilled, ChatLaunch } from '@carbon/icons-react';
import React, { useState } from 'react';

import { SvgIcon, CarbonButton, CarbonIconButton, CarbonInlineLoading } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import {
  EVENT_AI_SHOW_MORE_INCIDENTS,
  EVENT_AI_SHOW_MORE_ACTIONS,
  EVENT_AI_SHARE_OPENED,
  EVENT_AI_RUN_ACTION,
  NOTES_SUMMARY_FEEDBACK_NEGATIVE,
  NOTES_SUMMARY_FEEDBACK_POSITIVE,
  NOTES_SUMMARY_FEEDBACK_SUBMIT
} from 'in-services/tracking/eventNames';
import {
  convertIncidentSummaryToString,
  convertActionsToString,
  convertTopActionsToString,
  convertNotesSummaryToString
} from 'in-events/components/NotesAndActivity/components/NoteTypes/utils';
import useScoredActions, { useUserRecommendedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import FeedbackModal from 'in-events/components/NotesAndActivity/components/NoteTypes/FeedbackModal';
import { TopThreeActions } from 'in-events/components/NotesAndActivity/components/TopThreeActions';
import { handleTracking } from 'in-events/components/NotesAndActivity/components/utils';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { incidentNotesTopActionsEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import useAction from 'in-automation/ActionCatalog/useAction';
import { eventsPath } from 'in-events/navigation/paths';
import { getEvent } from 'in-stores/events';
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
  const [feedbackState, setFeedbackState] = useState(null); // up, down, or null

  // Little Slice function for grabbing the first 5 entries for incidents / actions
  const subArray = (arr, i = 0, n = 1) => arr?.slice(i, n);

  // Calculate the first 5 and last values for incidents / actions
  // These are used to determine if their show more buttons should be visible
  const relatedEventSummary = noteObj?.data?.get('watsonxSummary')?.get('recentEventsSummary') || [];
  const firstFiveRelated = subArray(relatedEventSummary, 0, 5);
  const lastRelated = subArray(relatedEventSummary, 5, relatedEventSummary.size);
  const actionHistory = noteObj?.data?.get('actionHistorySummary') || [];
  const triggeringEvent = useObservable(getEvent(event?.get('triggeringEvent')), [event?.get('triggeringEvent')]);
  const trigger = useTrigger({ event: event?.toJS() || {} });
  const userActions = useScoredActions({ trigger, event: event?.toJS() || {}, type: 'default' });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions });
  const firstThreeActions = (recommendedActions?.data || []).slice(0, 3);
  const firstFiveAction = subArray(actionHistory, 0, 5);
  const lastAction = subArray(actionHistory, 5, actionHistory.size);
  // Only one entry so dont need show more
  const notesSummaryData = noteObj?.data?.get('watsonxSummary')?.get('notesSummary') || [];
  // The full summarization that includes incident, notes, and action summary
  // Used for copy and share button
  const incidentSummary = convertIncidentSummaryToString(relatedEventSummary);
  const notesSummary = convertNotesSummaryToString(notesSummaryData);
  const actionHistorySummary = incidentNotesTopActionsEnabled
    ? convertTopActionsToString(recommendedActions?.data || [])
    : convertActionsToString(actionHistory);
  const fullSummaryText = `${incidentSummary}${notesSummary}\n${actionHistorySummary}`;

  //Feedback collection
  const { trackCta } = useSegmentTracking();
  const { location } = useNavigation();
  const summaryFeedbackObject = {
    summaryID: noteObj?.id,
    eventID: location?.matrix[eventsPath]?.eventId
  };

  function submitTracking(feedbackObject) {
    const trackingObj = {
      id: noteObj.id,
      ...feedbackObject
    };
    trackCta(NOTES_SUMMARY_FEEDBACK_SUBMIT, trackingObj);
  }
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
      {!incidentNotesTopActionsEnabled && (
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
      )}
      {incidentNotesTopActionsEnabled && (
        <TopThreeActions
          recommendedActions={recommendedActions}
          firstThreeActions={firstThreeActions}
          triggeringEvent={triggeringEvent?.toJS()}
          trigger={trigger}
        />
      )}

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
        {/* Positive feedback button */}
        <CarbonIconButton
          kind={'ghost'}
          size={'sm'}
          label={t('in-events:notes.positiveFeedback')}
          onClick={() => {
            setFeedbackState('up');
            trackCta(NOTES_SUMMARY_FEEDBACK_POSITIVE, summaryFeedbackObject);
          }}
        >
          {feedbackState === 'up' ? <ThumbsUpFilled size={'16'} /> : <ThumbsUp size={'16'} />}
        </CarbonIconButton>
        {/* Negative feedback button */}
        <CarbonIconButton
          kind={'ghost'}
          size={'sm'}
          label={t('in-events:notes.negativeFeedback')}
          onClick={() => {
            setFeedbackState('down');
            trackCta(NOTES_SUMMARY_FEEDBACK_NEGATIVE, summaryFeedbackObject);
          }}
        >
          {feedbackState === 'down' ? <ThumbsDownFilled size={'16'} /> : <ThumbsDown size={'16'} />}
        </CarbonIconButton>
      </div>

      {/* Share feedback button */}
      {feedbackState && (
        <CarbonButton
          kind="tertiary"
          className={locals.feedbackSurveyBtn}
          size="sm"
          onClick={() => {
            addActiveDialog(<FeedbackModal handleSubmitTracking={submitTracking} feedbackState={feedbackState} />);
          }}
          renderIcon={() => <ChatLaunch size="16" />}
        >
          <div className={locals.surveyBtnContents}> {t('in-events:notes.surveyButtonTxt')}</div>
        </CarbonButton>
      )}
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

// Simple avatar to mimick that of the ai chat
export function WatsonAIAvatar() {
  const a = `a-${generateUniqueShortId()}`;
  const b = `b-${generateUniqueShortId()}`;
  const c = `c-${generateUniqueShortId()}`;
  const d = `d-${generateUniqueShortId()}`;
  const e = `e-${generateUniqueShortId()}`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={locals.watsonxAvatar}>
      <defs>
        <linearGradient
          id={a}
          x1="1186.526"
          y1="2863.168"
          x2="1199.825"
          y2="2845.109"
          gradientTransform="matrix(.8312 .55596 -.27409 .40979 -198.894 -1827.398)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".3" />
          <stop offset="1" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={b}
          x1="1189.388"
          y1="2911.794"
          x2="1200.478"
          y2="2896.735"
          gradientTransform="rotate(146.223 380.87 -882.286) scale(1 -.493)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".3" />
          <stop offset=".9" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={c}
          x1="-4995.033"
          y1="-20162.835"
          x2="-4981.733"
          y2="-20180.895"
          gradientTransform="rotate(-146.223 -971.422 -5714.55) scale(1 .493)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset=".32" />
          <stop offset=".354" stopOpacity=".798" />
          <stop offset=".7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={d} x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset=".1" stopColor="#a56eff" />
          <stop offset=".9" stopColor="#0f62fe" />
        </linearGradient>
        <mask id={e} x="0" y="0" width="32" height="32" maskUnits="userSpaceOnUse">
          <path
            d="M16 1A14.915 14.915 0 0 0 5.502 5.286l1.4 1.429A12.922 12.922 0 0 1 16 3.001c.977 0 1.929.109 2.845.315-3.402.921-5.916 4.026-5.916 7.715 0 .782.118 1.537.328 2.252a7.978 7.978 0 0 0-2.188-.312c-3.704 0-6.819 2.534-7.726 5.957a12.954 12.954 0 0 1-.345-2.927c0-2.117.492-4.134 1.462-5.996l-1.773-.924A15.037 15.037 0 0 0 .999 16c0 8.271 6.729 15 15 15 3.949 0 7.678-1.522 10.498-4.286l-1.4-1.428A12.926 12.926 0 0 1 15.999 29c-3.648 0-6.945-1.516-9.309-3.945a5.959 5.959 0 0 1-1.621-4.086c0-3.309 2.691-6 6-6a6.006 6.006 0 0 1 5.897 7.107l1.967.367a7.971 7.971 0 0 0-.192-3.726 7.976 7.976 0 0 0 2.187.312c3.71 0 6.829-2.542 7.73-5.974.22.947.34 1.931.34 2.944 0 2.117-.492 4.134-1.462 5.995l1.773.924a15.034 15.034 0 0 0 1.688-6.919C31 7.729 24.272 1 16 1zm4.93 16.03c-3.309 0-6-2.692-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"
            style={{ fill: '#fff', strokeWidth: 0 }}
          />
          <path style={{ fill: `url(#${a})`, strokeWidth: 0 }} d="M8 9 0 0h16l2.305 3.304L8 9z" />
          <path style={{ fill: `url(#${b})`, strokeWidth: 0 }} d="m12 31 4.386-9L6 21 2 31h10z" />
          <path style={{ fill: `url(#${c})`, strokeWidth: 0 }} d="m24 23 8 9H16l-2.304-3.305L24 23z" />
          <path style={{ strokeWidth: 0 }} d="M16 31h-4.283L15 22h2l-1 9z" />
        </mask>
      </defs>
      <g style={{ mask: `url(#${e})` }}>
        <path style={{ fill: `url(#${d})`, strokeWidth: 0 }} d="M0 0h32v32H0z" />
      </g>
      <circle cx="6" cy="6" r="2" style={{ fill: '#001d6c', strokeWidth: 0 }} />
      <circle cx="26" cy="26" r="2" style={{ fill: '#001d6c', strokeWidth: 0 }} />
      <path
        d="M16 31c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"
        style={{ fill: '#001d6c', strokeWidth: 0 }}
      />
    </svg>
  );
}
