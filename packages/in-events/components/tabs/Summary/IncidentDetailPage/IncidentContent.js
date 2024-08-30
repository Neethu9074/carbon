/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { getTimeConfigForSnapshotRetrieval } from 'in-events/components/eventUtil';
import EventSummarization from 'in-events/components/legacy/EventSummarization';
import IncidentEventListRows from 'in-events/components/legacy/EventList';
import { incidentSummarizationEnabled } from 'in-services/featureFlags';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

const IncidentContent = ({ incident, latestSnapshot }) => {
  const snapshot = useObservable(
    getSnapshot(incident.get('entityId'), getTimeConfigForSnapshotRetrieval(incident, latestSnapshot)).startWith(null),
    [incident]
  );

  return (
    <>
      {incidentSummarizationEnabled && incident && incident.get('metadata')?.has('incidentSummary') && (
        <EventSummarization
          title={t('in-events:incidentSummarization.incidentSummaryTitle')}
          incident={incident}
          latestSnapshot={latestSnapshot}
        />
      )}

      <IncidentEventListRows incident={incident} snapshot={snapshot} latestSnapshot={latestSnapshot} />
    </>
  );
};

export default IncidentContent;
