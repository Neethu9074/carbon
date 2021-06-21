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

export default function EventListItemContent({ event, latestSnapshot }) {
  const isOfflineEvent = event => isEntityVerificationEvent(event) || isHostAvailabilityEvent(event);

  return (
    <>
      <SubEntityInformation event={event} />
      <ProblemDescription event={event} />
      <DescriptionButtons>
        <EventSpecificationLink event={event} />
        <AnalyzeIssueCallsButton event={event} />
      </DescriptionButtons>
      <Spacer vertical="normal" />
      {isOfflineEvent(event) ? (
        <OfflineEventDescription event={event} latestSnapshot={latestSnapshot} />
      ) : (
        <EventChart event={event} />
      )}
    </>
  );
}
