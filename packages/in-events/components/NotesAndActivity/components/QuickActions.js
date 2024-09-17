/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { SvgIcon, CarbonButton, CarbonInlineLoading } from '@instana/components';

import { EVENT_AI_GENERATE_SUBMIT } from 'in-services/tracking/eventNames';
import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { generateJournalSummary } from 'in-stores/events';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { user } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './QuickActions.mless';

// Main view that gives an overview for this side panel
// Gives the user the options to add a note or generate a summary
export function QuickActions(props) {
  const { displayQuickStart, incidentId, summaryCount } = props;
  // To prevent multiple clicks of the generate summary button
  // add a enable boolean thats set to false on click and re enabled
  // after 5 seconds have passed
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [thisSummaryCount, setThisSummaryCount] = useState(summaryCount);
  // In order to WAIT for the summary to return we are looking at the summary count
  // We know the summary count before the summary generation is clicked. Once clicked
  // we start the loading spinner and ONLY turn it off once the summary count has increased
  // when it increases then we know the summary is here.
  if (loadingSummary) {
    if (thisSummaryCount + 1 == summaryCount) {
      setThisSummaryCount(summaryCount);
      setLoadingSummary(false);
    }
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
          <SvgIcon type={'lib_help_error_help_circle'} />
        </div>
      )}
      <div>
        {displayQuickStart && (
          <>
            <div className={locals.quickActionsHeader}>{t('in-events:notes.summarizeIncident')}</div>
            <div className={locals.quickActionsDescription}>{t('in-events:notes.summarizeIncidentDescription')}</div>
          </>
        )}
        <CarbonButton
          kind={'tertiary'}
          className={locals.actionsButton}
          size={'sm'}
          disabled={loadingSummary}
          renderIcon={() => {
            return (
              <>
                {!loadingSummary ? (
                  <SvgIcon type={'lib_generate_ai'} color="currentColor" size="xs" />
                ) : (
                  <CarbonInlineLoading className={locals.generating} />
                )}
              </>
            );
          }}
          onClick={() => {
            setThisSummaryCount(summaryCount);
            setLoadingSummary(true);
            handleAIGenerateNote(incidentId);
          }}
        >
          <div className={locals.quickActionButtonContents}>{t('in-events:notes.generateSummary')}</div>
        </CarbonButton>
      </div>
    </div>
  );
}

// Handle the button click for ai generation
// Track the clicks
export function handleAIGenerateNote(incidentId) {
  generateJournalSummary(incidentId);
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: EVENT_AI_GENERATE_SUBMIT,
      path: location.hash
    };
    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }
  track(EVENT_AI_GENERATE_SUBMIT, { incidentId, author: user.preferredName });
}
