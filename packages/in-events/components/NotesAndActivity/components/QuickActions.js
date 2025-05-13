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
  CarbonInlineLoading,
  HelpText,
  PreviewPill,
  Typography,
  Link
} from '@instana/components';
import { useObservable } from '@instana/hooks';

import { EVENT_AI_GENERATE_SUBMIT, NOTES_SUMMARY_CLICK_EPWT_LINK } from 'in-services/tracking/eventNames';
import { handleTracking } from 'in-events/components/NotesAndActivity/components/utils';
import { AIPopover } from 'in-events/components/NotesAndActivity/components/AiPopover';
import { automationActionAiGenerationUnitEnabled } from 'in-services/featureFlags';
// import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';
import { summaryNotes$, setSummaryNotes } from 'in-stores/incidents';
import { generateJournalSummary } from 'in-stores/events';

import locals from './QuickActions.mless';

// var testThis = false;

// Main view that gives an overview for this side panel
// Gives the user the options to add a note or generate a summary
export function QuickActions(props) {
  const { displayQuickStart, incidentId, summaryCount } = props;
  // To prevent multiple clicks of the generate summary button
  // add a enable boolean keeps track of the loading of the summary
  const [loadingSummary, setLoadingSummary] = useState(false);
  // Record the current summary count in order to know when the summary has
  // completed loading
  const [thisSummaryCount, setThisSummaryCount] = useState(summaryCount);
  // SummaryTimeout keeps track of the timeout ID
  const [summaryTimeout, setSummaryTimeout] = useState(0);
  // Timeout message is displayed only after 2 mins
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  // In order to WAIT for the summary to return we are looking at the summary count
  // We know the summary count before the summary generation is clicked. Once clicked
  // we start the loading spinner and ONLY turn it off once the summary count has increased
  if ((loadingSummary || showTimeoutMessage) && thisSummaryCount + 1 == summaryCount) {
    setThisSummaryCount(summaryCount);
    setLoadingSummary(false);
    clearTimeout(summaryTimeout);
    setShowTimeoutMessage(false);
  }

  // Look at the summaryNotes store to determine if the ai generation should occur
  const summaryNotesData = useObservable(summaryNotes$, [summaryNotes$]);
  if (summaryNotesData?.generateAISummary == true) {
    handleSummaryGenerate();
    // Keep the side panel open but turn off the ai generation after its began
    setSummaryNotes(true, false);
  }

  function handleSummaryGenerate() {
    // Set the current summary count BEFORE generating the summary
    setThisSummaryCount(summaryCount);
    // Start the loading spinner
    setLoadingSummary(true);
    // Generate API Call
    generateJournalSummary(incidentId);
    // Tacking clicks
    handleTracking(incidentId, EVENT_AI_GENERATE_SUBMIT);
    // Timeout is started for a max of 2 mins and then the
    // spinner will terminate and we will show a timeout message
    const id = setTimeout(() => {
      setLoadingSummary(false);
      setShowTimeoutMessage(true);
    }, 120000); // 2 mins
    setSummaryTimeout(id);
  }

  function consentSection() {
    return (
      <div className={locals.consentWrapper}>
        <Typography variant="legal-02"> {t('in-events:consentForm.consentText')} </Typography>
        <CarbonButton
          kind="tertiary"
          size={'sm'}
          className={locals.actionsButton}
          target="_blank"
          onClick={e => {
            handleTracking(incidentId, NOTES_SUMMARY_CLICK_EPWT_LINK);
            e.stopPropagation();
          }}
          renderIcon={() => {
            return <SvgIcon type={'lib_views_external_link'} color="currentColor" size="xs" />;
          }}
          href="https://early-access.ibm.com/software/support/trial/cst/welcomepage.wss?siteId=2175&tabId=6106&w=1&_gl=1*a8q9zh*_ga*NDA2OTcyMzgyLjE3MTEzODYwOTA.*_ga_FYECCCS21D*MTc0MTM0MzI4NS41MS4xLjE3NDEzNDM5NjUuMC4wLjA"
        >
          <div className={locals.quickActionButtonContents}>{t('in-events:consentForm.consentButton')}</div>
        </CarbonButton>
      </div>
    );
  }

  function quickActionsContent() {
    return (
      <div>
        <CarbonButton
          kind={'tertiary'}
          className={locals.actionsButton}
          size={'sm'}
          id="generate_summary_ai"
          disabled={loadingSummary}
          renderIcon={() => {
            return (
              <>
                {!loadingSummary ? (
                  <SvgIcon type={'lib_generate_ai'} color="currentColor" size="xs" id="ai_summary_loading" />
                ) : (
                  <CarbonInlineLoading className={locals.generating} />
                )}
              </>
            );
          }}
          onClick={() => {
            handleSummaryGenerate();
          }}
        >
          <div className={locals.quickActionButtonContents}>{t('in-events:notes.generateSummary')}</div>
        </CarbonButton>
        {showTimeoutMessage && <HelpText>{t('in-events:notes.waitAFewMins')}</HelpText>}
      </div>
    );
  }

  return (
    <div
      className={classNames({
        [locals.quickActionWrapper]: true,
        [locals.extraPadding]: !displayQuickStart,
        [locals.transitionDown]: displayQuickStart
      })}
    >
      {displayQuickStart && (
        <div>
          <AIPopover />
        </div>
      )}
      <div>
        {displayQuickStart && (
          <>
            <div className={locals.quickActionsHeader}>
              {t('in-events:notes.summarizeIncident')}
              <PreviewPill privatePreview />
              <div className={locals.feedbackWrapper}>
                <Link href="https://your.feedback.ibm.com/jfe/form/SV_5je3oKfjA0NZM0e" externalWithIcon>
                  {t('in-events:notes.feedback')}
                </Link>
              </div>
            </div>
            {automationActionAiGenerationUnitEnabled && (
              <div className={locals.quickActionsDescription}>{t('in-events:notes.summarizeIncidentDescription')}</div>
            )}
          </>
        )}
        {automationActionAiGenerationUnitEnabled ? quickActionsContent() : consentSection()}
      </div>
    </div>
  );
}
