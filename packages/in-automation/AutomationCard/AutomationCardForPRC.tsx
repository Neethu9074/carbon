/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { List, Map } from 'immutable';

import { EntityId, Event, VolatileId } from '@instana/types';
import { Card, Spacer } from '@instana/components';

import determineEntityTypeFromEntityIDMap, {
  QualifiedRCAEntityTypes
} from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import AutomationCardButtonGroup, { useActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';
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

export type ProcessedSnapshot = {
  rcaSnapshotID: string | null;
  rcaEntityType: QualifiedRCAEntityTypes;
  rootCause: RootCause;
  translationEntityType?: string;
  entityData?: any; // Can be any type based on what entityData contains
};

function AutomationCardForPRC({ volatileId, event, incident }: AutomationCardProps) {
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);

  const rootCauseSnapshotPath = incident?.hasIn(['metadata', 'rootCause', 'currentRootCause'])
    ? ['metadata', 'rootCause', 'currentRootCause']
    : ['metadata', 'rootCause'];

  const rootCauseSnapshotMap = (
    incident?.getIn(rootCauseSnapshotPath, Map()) as Map<string, RootCause> | List<RootCause>
  )
    .sort((a: RootCause, b: RootCause) => (b.get('probFailure') as number) - (a.get('probFailure') as number))
    .filter((rootCauseEntity: RootCause | undefined) => {
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
  let rootCauseSnapshots: [string, RootCause][] = [];
  if (List.isList(rootCauseSnapshotMap)) {
    rootCauseSnapshots = rootCauseSnapshotMap
      .map((rootCause: RootCause | undefined) => {
        if (!rootCause) return;
        const id = rootCause?.get('snapshotId');

        return [id, rootCause];
      })
      .toArray() as [string, RootCause][];
  } else if (Map.isMap(rootCauseSnapshotMap)) {
    // legacy where we had a map of snapshot Ids with respective root cause directly
    rootCauseSnapshots = rootCauseSnapshotMap.entrySeq().toArray() as [string, RootCause][];
  }

  // then in my rootcause Snapshots, store it in a value both values
  const timeWindow = getIncidentTimeConfig(incident);

  // Step 1: Process snapshots to extract rcaEntityType and rcaSnapshotID
  const initialSnapshots: ProcessedSnapshot[] = rootCauseSnapshots
    .map(([rcaSnapshotID, rootCause]) => {
      if (!rootCause) return null;

      const entityID = rootCause.get('entityID') as Map<string, string>;
      const entityType = determineEntityTypeFromEntityIDMap(entityID.toJS() as EntityId);
      const translationEntityType = rootCause?.getIn(['entityID', 'pluginId']);
      const finalRcaSnapshotID =
        entityType === 'infrastructure' ? rcaSnapshotID : rootCause?.getIn(['entityID', 'steadyId']);

      return {
        rcaSnapshotID: finalRcaSnapshotID,
        rcaEntityType: entityType,
        rootCause,
        translationEntityType: translationEntityType,
        type: 'rootcause',
        entityData: null // Will be updated after fetching
      };
    })
    .filter(Boolean) as ProcessedSnapshot[];

  const activeKey = useActiveKey();
  // const policies = usePolicies({ event });
  const historyCount = useHistory({ eventId: event.id });
  const trigger = useTrigger({ event });
  const userActions = useScoredActions({ event, trigger, type: 'default' });
  const ootbActions = useScoredActions({ event, trigger, type: 'watsonx' });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions });
  const ootbRecommendedActions = useAIRecommendedScoredActions({ actions: ootbActions });
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card>
          <AutomationCardButtonGroup
            recommendedActionsCount={recommendedActions?.data?.length}
            actionHistoryCount={historyCount}
          />
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
          {activeKey === 'actionHistory' && (
            <>
              <Spacer vertical="small" />
              <ActionHistoryTable eventId={event.id} />
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}

function AutomationCardWithOptimization({ volatileId, event, incident }: AutomationCardProps) {
  return (
    <>
      <AutomationCardForPRC volatileId={volatileId} event={event} incident={incident} />
    </>
  );
}

export default function AutomationCardWrapper({ volatileId, event, incident }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCardWithOptimization volatileId={volatileId} event={event} incident={incident} />;
}
