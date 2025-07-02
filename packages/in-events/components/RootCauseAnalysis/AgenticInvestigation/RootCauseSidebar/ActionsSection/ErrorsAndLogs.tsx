/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 * */

// eslint-disable-next-line no-restricted-imports
import { Tearsheet } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { Loading } from '@carbon/react';
import React, { useContext, useMemo } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import RootCauseContextDashboard from 'in-events/components/RootCauseAnalysis/Logs/RootCauseContextDashboard';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Endpoint } from 'in-types';
import { t } from 'in-i18n';

import locals from './ActionsSection.mless';

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

interface ErrorsAndLogsProps {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}
const ErrorsAndLogs = ({ isOpen, setIsOpen }: ErrorsAndLogsProps) => {
  const { location } = useNavigation();

  const { selectedEntityId } = useEntitySelection();
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  const rootCauseIndex = rootCauses?.findIndex(rc => rc.entityData?.id === selectedEntityId);
  const rootCause = rootCauseMetadata[rootCauseIndex] ?? null;
  const { incident } = useIncident();

  const incidentTimeWindow = useMemo(() => getIncidentTimeConfig(incident), [incident]);

  const {
    entityData,
    nonInfraServiceLabelInformation,
    infraServiceLabelInformation,
    loadingSnapshotData,
    loadingStackData,
    entityType: rcaEntityType
  } = rootCauses[rootCauseIndex] || {
    entityData: null,
    nonInfraServiceLabelInformation: null,
    infraServiceLabelInformation: null
  };

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

  const probabilityScore = rootCause?.probFailure;
  const rcaTrackingData = {
    event: incident,
    location,
    rcaEntityType: rcaEntityType,
    probabilityScore
  };

  return (
    //@ts-expect-error
    <Tearsheet
      id={'errorslogs-tearsheet'}
      open={isOpen}
      hasCloseIcon
      onClose={() => setIsOpen(false)}
      closeIconDescription={t('in-events:RCA.close')}
      title={t('in-events:RCA.relatedMessagesAndLogsLabel')}
    >
      <div className={locals.tearsheetContent}>
        {(loadingStackData || loadingSnapshotData) && <Loading active className="some-class" description="Loading" />}
        {entityData && (infraServiceLabelInformation || nonInfraServiceLabelInformation) && (
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
            rcaTrackingData={rcaTrackingData}
          />
        )}
      </div>
    </Tearsheet>
  );
};

export default ErrorsAndLogs;
