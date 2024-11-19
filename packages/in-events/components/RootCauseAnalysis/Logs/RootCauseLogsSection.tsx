/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import useFetchAppropriateRCAEntityData from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import RootCauseContextDashboard from 'in-events/components/RootCauseAnalysis/Logs/RootCauseContextDashboard';
import { EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import getApplication from 'in-applications/subscriptions/getApplication';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseLogsSectionProps {
  rcaEntityType: string;
  rcaSnapshotID: string;
  incidentTimeWindow: TimeConfig;
  relatedAPID: string | null;
}

export default function RootCauseLogsSection({
  rcaEntityType,
  rcaSnapshotID,
  incidentTimeWindow,
  relatedAPID
}: RootCauseLogsSectionProps) {
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const { entityData, nonInfraServiceLabelInformation, infraServiceLabelInformation } =
    useFetchAppropriateRCAEntityData(rcaEntityType, rcaSnapshotID, incidentTimeWindow);

  // Holds the result of our related application perspective observable
  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [relatedAPID]
  );

  return (
    <Collapsible
      onOpen={() => {
        const instrumentationEventProperties = { expanded: true };
        trackCta(EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK, instrumentationEventProperties, SEGMENT_EVENT_PROPERTY_CHANNEL);
      }}
    >
      <Collapsible.Header style={{ background: 'none' }}>
        <Typography variant="body-regular">{t('in-events:RCA.relatedMessagesAndLogsLabel')}</Typography>
      </Collapsible.Header>
      <Collapsible.Content>
        <div className={locals.accordionContent}>
          {entityData !== null && (
            <RootCauseContextDashboard
              applicationBoundaryScope="ALL"
              serviceId={nonInfraServiceLabelInformation?.id || infraServiceLabelInformation[0]?.id}
              serviceName={nonInfraServiceLabelInformation?.label || infraServiceLabelInformation[0]?.label}
              applicationId={relatedApplicationInformation?.id}
              applicationName={relatedApplicationInformation?.label}
              endpointId={rcaEntityType === 'endpoint' ? entityData.steadyId : undefined}
              endpointName={rcaEntityType === 'endpoint' ? entityData.label : undefined}
              timeConfig={incidentTimeWindow}
            />
          )}
        </div>
      </Collapsible.Content>
    </Collapsible>
  );
}
