/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { get } from 'lodash';
import React from 'react';

import { Collapsible, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import useFetchAppropriateRCAEntityData from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import RootCauseContextDashboard from 'in-events/components/RootCauseAnalysis/Logs/RootCauseContextDashboard';
import { EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import getApplication from 'in-applications/subscriptions/getApplication';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
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

  const {
    entityData,
    nonInfraServiceLabelInformation,
    infraServiceLabelInformation,
    loadingSnapshotData,
    loadingStackData
  } = useFetchAppropriateRCAEntityData(rcaEntityType, rcaSnapshotID, incidentTimeWindow);

  // Holds the result of our related application perspective observable
  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [relatedAPID]
  );

  if (!entityData && (loadingSnapshotData || loadingStackData)) return <LoadingIndicator />;

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
          {entityData && (
            <RootCauseContextDashboard
              applicationBoundaryScope="ALL"
              serviceId={nonInfraServiceLabelInformation?.id || infraServiceLabelInformation[0]?.id}
              serviceName={nonInfraServiceLabelInformation?.label || infraServiceLabelInformation[0]?.label}
              applicationId={relatedApplicationInformation?.id}
              applicationName={relatedApplicationInformation?.label}
              rcaEntityType={rcaEntityType}
              endpointId={rcaEntityType === 'endpoint' ? entityData.steadyId : undefined}
              endpointName={rcaEntityType === 'endpoint' ? entityData.label : undefined}
              processId={rcaEntityType === 'infrastructure' ? getProcessId(entityData) : undefined}
              containerId={rcaEntityType === 'infrastructure' ? getContainerId(entityData) : undefined}
              processContainerType={rcaEntityType === 'infrastructure' ? getProcessContainerId(entityData) : undefined}
              hostName={rcaEntityType === 'infrastructure' ? getHostFQDN(entityData) : undefined}
              plugin={rcaEntityType === 'infrastructure' ? get(entityData, 'plugin') : undefined}
              timeConfig={incidentTimeWindow}
            />
          )}
        </div>
      </Collapsible.Content>
    </Collapsible>
  );
}

export function isContainer(plugin: string) {
  const containerPlugins = ['docker', 'crio', 'garden', 'containerd', 'awsEcsContainer', 'podman'];
  return containerPlugins.includes(plugin);
}

function getProcessContainerId(entityData: SnapshotData) {
  const plugin = get(entityData, 'plugin', '');
  return plugin === 'process' ? get(entityData, 'data.containerType', undefined) : undefined;
}

function getContainerId(entityData: SnapshotData) {
  const plugin = get(entityData, 'plugin', '');
  return plugin === 'process'
    ? get(entityData, 'data.container', undefined)
    : isContainer(plugin)
    ? get(entityData, 'data.id')
    : undefined;
}

function getProcessId(entityData: SnapshotData) {
  const plugin = get(entityData, 'plugin', '');
  return plugin === 'process' ? get(entityData, 'data.pid', undefined) : undefined;
}

function getHostFQDN(entityData: SnapshotData) {
  const plugin = get(entityData, 'plugin', '');
  return plugin === 'host' ? get(entityData, 'data.hostname', undefined) : undefined;
}
