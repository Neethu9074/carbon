import React from 'react';

import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import AnalyzeIssueCallsButton from 'in-events/components/legacy/AnalyzeIssueCallsButton';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import SubEntityInformation from 'in-events/components/legacy/SubEntityInformation';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import EventChart from 'in-events/components/EventChart';
import Spacer from 'in-events/components/legacy/Spacer';

export default function EventListItemContent({ event }) {
  const isOfflineEvent = event => event.hasIn(['metadata', 'entityVerificationSnapshotId']);

  return (
    <>
      <SubEntityInformation event={event} />
      <ProblemDescription event={event} />
      <DescriptionButtons>
        <EventSpecificationLink event={event} />
        <AnalyzeIssueCallsButton event={event} />
      </DescriptionButtons>
      <Spacer />
      {isOfflineEvent(event) ? <OfflineEventDescription event={event} /> : <EventChart event={event} />}
    </>
  );
}
