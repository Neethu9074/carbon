/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext, useMemo } from 'react';
import { get } from 'lodash';

import { Collapsible, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import RootCauseContextDashboard from 'in-events/components/RootCauseAnalysis/Logs/RootCauseContextDashboard';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import getApplication from 'in-applications/subscriptions/getApplication';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Endpoint, Event } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/legacy/EventList.mless';

interface RootCauseLogsSectionProps {
  incident: Event;
}

const RootCauseLogsSection = ({ incident }: RootCauseLogsSectionProps) => {
  const { selectedRootCause } = useContext(SelectedRootCauseContext);
  const SEGMENT_EVENT_PROPERTY_CHANNEL = 'root cause analysis';
  const { trackCta } = useSegmentTracking();

  const incidentTimeWindow = useMemo(() => getIncidentTimeConfig(incident), [incident]);

  const { rootCauses } = useContext(RootCauseDataContext);

  const {
    entityData,
    nonInfraServiceLabelInformation,
    infraServiceLabelInformation,
    loadingSnapshotData,
    loadingStackData,
    entityType: rcaEntityType
  } = rootCauses[selectedRootCause];

  const relatedAPID = get(incident, 'metadata.app20ApplicationId', null);
  // Holds the result of our related application perspective observable
  const relatedApplicationInformation = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map(data => data.data)
          .throttle(250)
      : null,
    [relatedAPID]
  );

  if (loadingStackData || loadingSnapshotData) return <LoadingIndicator />;

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
          {entityData && infraServiceLabelInformation && nonInfraServiceLabelInformation && (
            <RootCauseContextDashboard
              applicationBoundaryScope="ALL"
              serviceId={nonInfraServiceLabelInformation?.id || infraServiceLabelInformation?.[0]?.id}
              serviceName={nonInfraServiceLabelInformation?.label || infraServiceLabelInformation?.[0]?.label}
              applicationId={relatedApplicationInformation?.id}
              applicationName={relatedApplicationInformation?.label}
              rcaEntityType={rcaEntityType}
              endpointId={rcaEntityType === 'endpoint' ? (entityData as Endpoint).id : undefined}
              endpointName={rcaEntityType === 'endpoint' ? (entityData as Endpoint).label : undefined}
              processId={rcaEntityType === 'infrastructure' ? getProcessId(entityData as SnapshotData) : undefined}
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
};

export default RootCauseLogsSection;

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
