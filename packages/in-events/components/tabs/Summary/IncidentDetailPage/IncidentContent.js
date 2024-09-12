/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import IncidentEventListRows from 'in-events/components/legacy/EventList';
import { getSnapshot } from 'in-stores/snapshot';

const IncidentContent = ({ incident, latestSnapshot }) => {
  const snapshot = useObservable(
    getSnapshot(incident.get('entityId'), getTimeConfigForSnapshotRetrieval(incident, latestSnapshot)).startWith(null),
    [incident]
  );

  return (
    <>
      <IncidentEventListRows incident={incident} snapshot={snapshot} latestSnapshot={latestSnapshot} />
    </>
  );
};

export default IncidentContent;
