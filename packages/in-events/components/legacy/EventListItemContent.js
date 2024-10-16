/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { isEntityVerificationEvent, isHostAvailabilityEvent } from 'in-events/components/eventUtil';
import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import EventChart from 'in-events/components/EventChart';

export default function EventListItemContent({ event, latestSnapshot, justChart = false }) {
  const isOfflineEvent = event => isEntityVerificationEvent(event) || isHostAvailabilityEvent(event);
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

  return (
    <>
      {!justChart && (
        <>
          <SubEntityInformation event={event} />
          <ProblemDescription fixSuggestion={fixSuggestion} />
          <DescriptionButtons>
            <EventSpecificationLink event={event.toJS()} />
            <AnalyzeIssueCallsButton event={event} />
          </DescriptionButtons>
          <Spacer vertical="normal" />
        </>
      )}
      {isOfflineEvent(event) ? (
        <OfflineEventDescription event={event} latestSnapshot={latestSnapshot} />
      ) : (
        <EventChart event={event} />
      )}
    </>
  );
}
