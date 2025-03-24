/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { List, Map } from 'immutable';

import { Card, Spacer } from '@instana/components';
import { Event, VolatileId } from '@instana/types';
import { TimeConfig } from '@instana/types';

import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import AutomationCardButtonGroup, { useActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import { ProbableCauseType } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { translateFullyQualifiedPluginToShortPluginName } from 'in-forge/constants';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import AutomationPolicies from 'in-automation/AutomationCard/AutomationPolicies';
import usePolicies from 'in-automation/AutomationCard/usePolicies';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { minutes } from 'in-services/time/time';
import { EventOrMap } from 'in-events/types';

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
  incident: EventOrMap;
}

type RootCause = {
  get: (key: string) => any;
  getIn: (path: string[]) => any;
};

// type Snapshot = [string, RootCause];
export type ProcessedSnapshot = {
  rcaSnapshotID: string | null;
  rcaEntityType: string;
  rootCause: RootCause;
  entityData?: any; // Can be any type based on what entityData contains
};

function AutomationCardForPrc({ volatileId, event, incident }: AutomationCardProps) {
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);

  const rootCauseSnapshotPath = incident?.hasIn(['metadata', 'rootCause', 'currentRootCause'])
    ? ['metadata', 'rootCause', 'currentRootCause']
    : ['metadata', 'rootCause'];

  const rootCauseSnapshotMap = (
    incident?.getIn(rootCauseSnapshotPath, Map()) as Map<string, ProbableCauseType> | List<ProbableCauseType>
  )
    .sort(
      (a: ProbableCauseType, b: ProbableCauseType) =>
        (b.get('probFailure') as number) - (a.get('probFailure') as number)
    )
    .filter((rootCauseEntity: ProbableCauseType | undefined) => {
      // Filtering out entities with no erroneous rate through the identified root cause
      if (!rootCauseEntity) return false;

      const explainabilityMetadata = rootCauseEntity.get('explainability') as List<
        Map<string, string | number | boolean>
      >;
      const aggreagatedInfo = explainabilityMetadata.find(service => service?.get('connectedServiceId') === 'all');

      if (aggreagatedInfo.get('percentageFailedThroughRC') === 0) {
        return false;
      }
      return true;
    });

  //String in this case is snapshot ID
  let rootCauseSnapshots: [string, ProbableCauseType][] = [];
  if (List.isList(rootCauseSnapshotMap)) {
    rootCauseSnapshots = rootCauseSnapshotMap
      .map((rootCause: ProbableCauseType | undefined) => {
        if (!rootCause) return;
        const id = rootCause?.get('snapshotId');

        return [id, rootCause];
      })
      .toArray() as [string, ProbableCauseType][];
  } else if (Map.isMap(rootCauseSnapshotMap)) {
    // legacy where we had a map of snapshot Ids with respective root cause directly
    rootCauseSnapshots = rootCauseSnapshotMap.entrySeq().toArray() as [string, ProbableCauseType][];
  }

  // then in my rootcause Snapshots, store it in a value both values
  const timeWindow = getIncidentTimeConfig(incident);

  // Step 1: Process snapshots to extract rcaEntityType and rcaSnapshotID
  const initialSnapshots: ProcessedSnapshot[] = rootCauseSnapshots
    .map(([rcaSnapshotID, rootCause]) => {
      if (!rootCause) return null;

      const entityID = rootCause.get('entityID') as Map<string, string>;
      const entityType = determineEntityTypeFromEntityIDMap(entityID);
      const finalRcaSnapshotID =
        entityType === 'infrastructure' ? rcaSnapshotID : rootCause?.getIn(['entityID', 'steadyId']);

      return {
        rcaSnapshotID: finalRcaSnapshotID,
        rcaEntityType: entityType,
        rootCause,
        type: 'rootcause',
        entityData: null // Will be updated after fetching
      };
    })
    .filter(Boolean) as ProcessedSnapshot[];

  const activeKey = useActiveKey();

  const policies = usePolicies({ event });
  const historyCount = useHistory({ eventId: event.id });
  const trigger = useTrigger({ event });
  const userActions = useScoredActions({ event, trigger, type: 'default', selectedDescription, selectedEntityType });

  const ootbActions = useScoredActions({ event, trigger, type: 'watsonx' });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions, policies });
  const ootbRecommendedActions = useAIRecommendedScoredActions({ actions: ootbActions, policies });
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card>
          <AutomationCardButtonGroup
            policyCount={policies?.data?.length}
            recommendedActionsCount={recommendedActions?.data?.length}
            actionHistoryCount={historyCount}
          />
          {(activeKey === 'automationPolicies' || activeKey === 'recommendedActions') && <Spacer vertical="small" />}
          {activeKey === 'automationPolicies' && (
            <AutomationPolicies
              volatileId={volatileId}
              event={event}
              actions={userActions}
              policies={policies}
              trigger={trigger}
            />
          )}
          {activeKey === 'recommendedActions' && (
            <RecommendedActions
              event={event}
              volatileId={volatileId}
              trigger={trigger}
              recommendedActions={recommendedActions}
              ootbRecommendedActions={ootbRecommendedActions}
              initialSnapshots={initialSnapshots}
              timeWindow={timeWindow}
              setSelectedDescription={setSelectedDescription}
              setSelectedEntityType={setSelectedEntityType}
              selectedDescription={selectedDescription}
              selectedEntityType={selectedEntityType}
            />
          )}
          {activeKey === 'actionHistory' && <ActionHistoryTable eventId={event.id} />}
        </Card>
      </Col>
    </Row>
  );
}

function AutomationCardWithOptimization({ volatileId, event, incident }: AutomationCardProps) {
  return (
    <>
      <AutomationCardForPrc volatileId={volatileId} event={event} incident={incident} />
    </>
  );
}

export default function AutomationCardWrapper({ volatileId, event, incident }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCardWithOptimization volatileId={volatileId} event={event} incident={incident} />;
}

function determineEntityTypeFromEntityIDMap(entityID: Map<string, string>) {
  const pluginName = translateFullyQualifiedPluginToShortPluginName(entityID.get('pluginId'));

  if (pluginName === 'application' || pluginName === 'service' || pluginName === 'endpoint') return pluginName;

  return 'infrastructure';
}

function getIncidentTimeConfig(incident: EventOrMap): TimeConfig {
  return {
    windowSize:
      (incident.get('end') as number) - incident.getIn(['metadata', 'triggeringTime'], 0) + minutes.toMillis(20) ||
      (incident.get('end') as number) - (incident.get('start') as number) + minutes.toMillis(20),
    to: incident.get('end') as number,
    focusedMoment: incident.get('end') as number,
    autoRefresh: false
  };
}
