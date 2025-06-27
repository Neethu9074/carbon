/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import React, { useContext } from 'react';

import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import EntityPath from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EntityPath';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

const RootCauseEntityDetails: React.FC = () => {
  const { selectedEntityId } = useEntitySelection();

  // From the entityId, find the root cause metadata and the root cause all other data.
  const { rootCauses, rootCauseMetadata } = useContext(RootCauseDataContext);
  // const {selectedRootCause} = useContext(SelectedRootCauseContext);
  const { incident } = useIncident();
  const { location } = useNavigation();
  const { relatedAPInfo } = useRootCauseTopologyDataContext();

  const rootCause = rootCauses.find(rc => rc.entityData?.id === selectedEntityId);
  const rootCauseIndex = rootCauses.findIndex(rc => rc.entityData?.id === selectedEntityId);

  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log('The following keys will be used in the future');
    // eslint-disable-next-line no-console
    console.log({
      rootCauseMetadata,
      incident,
      location,
      relatedAPInfo,
      rootCause,
      rootCauseIndex
    });
  }

  return (
    <div>
      <EntityPath />
    </div>
  );
};

export default RootCauseEntityDetails;
