import React from 'react';

import OfflineEventDescription from 'in-events/components/legacy/OfflineEventDescription';
import EventSpecificationLink from 'in-events/components/legacy/EventSpecificationLink';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import EventChart from 'in-events/components/EventChart';
import Spacer from 'in-events/components/legacy/Spacer';

export default function EventListItemContent({ event }) {
  const isOfflineEvent = event => event.hasIn(['metadata', 'entityVerificationSnapshotId']);

  return (
    <>
      <ProblemDescription event={event} />
      <EventSpecificationLink event={event} />
      <Spacer />
      {isOfflineEvent(event) ? <OfflineEventDescription event={event} /> : <EventChart event={event} />}
    </>
  );
}
