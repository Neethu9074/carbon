/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode, createContext, useMemo } from 'react';
import { get } from 'lodash';

import useFetchAppropriateRCAEntityData, {
  NoAppropriateRCAEntityData,
  RCAEntityDataType
} from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import determineEntityTypeFromEntityIDMap, {
  QualifiedRCAEntityTypes
} from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { getRootCauses } from 'in-events/components/RootCauseAnalysis/utils/getRootCauses';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { Event } from 'in-types';

const getRCAProps = (
  rca: RootCause
): {
  entityType: QualifiedRCAEntityTypes;
  snapshotID: string;
} => {
  if (!rca) {
    return {
      entityType: 'unknown',
      snapshotID: ''
    };
  }
  const entityType = determineEntityTypeFromEntityIDMap(rca?.entityID);
  const snapshotID =
    entityType === 'infrastructure' || entityType === 'process' ? rca.snapshotId : rca.entityID.steadyId;

  return {
    entityType,
    snapshotID
  };
};

const useFetchAllRCAData = (incident: Event) => {
  const rootCauses = useMemo(() => getRootCauses(incident), [incident]);
  const incidentTimeWindow = useMemo(() => getIncidentTimeConfig(incident), [incident]);

  // triggeringEntity
  const triggeringEntityType = determineEntityTypeFromEntityIDMap({
    host: '',
    pluginId: get(incident, 'plugin'),
    steadyId: ''
  });

  const triggeringData = useFetchAppropriateRCAEntityData(
    triggeringEntityType,
    incident.entityId || '',
    incidentTimeWindow
  );

  const rca1 = rootCauses[0];
  const rca1props = getRCAProps(rca1);
  const rca2 = rootCauses[1];
  const rca2props = getRCAProps(rca2);
  const rca3 = rootCauses[2];
  const rca3props = getRCAProps(rca3);

  const rc1Data = useFetchAppropriateRCAEntityData(rca1props.entityType, rca1props.snapshotID, incidentTimeWindow);
  const rca2Data = useFetchAppropriateRCAEntityData(rca2props.entityType, rca2props.snapshotID, incidentTimeWindow);

  const rca3Data = useFetchAppropriateRCAEntityData(rca3props.entityType, rca3props.snapshotID, incidentTimeWindow);

  return {
    rootCauses: [rc1Data, rca2Data, rca3Data],
    rootCauseMetadata: rootCauses,
    triggeringData
  };
};

const defaultValue: {
  rootCauses: RCAEntityDataType[];
  rootCauseMetadata: RootCause[];
  triggeringData: RCAEntityDataType;
} = {
  rootCauses: [
    {
      ...NoAppropriateRCAEntityData,
      entityType: 'infrastructure'
    },
    {
      ...NoAppropriateRCAEntityData,
      entityType: 'infrastructure'
    },
    {
      ...NoAppropriateRCAEntityData,
      entityType: 'infrastructure'
    }
  ],
  rootCauseMetadata: [],
  triggeringData: {
    ...NoAppropriateRCAEntityData,
    entityType: 'infrastructure'
  }
};

const RootCauseDataContext = createContext(defaultValue);

const RootCauseDataProvider = ({ incident, children }: { incident: Event; children: ReactNode }) => {
  const rcaDatas = useFetchAllRCAData(incident);
  return <RootCauseDataContext.Provider value={rcaDatas}>{children}</RootCauseDataContext.Provider>;
};

export { RootCauseDataContext, RootCauseDataProvider };
