/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState, useEffect } from 'react';

import { Event, VolatileId } from '@instana/types';
import { Card } from '@instana/components';

import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { useEntitySelection } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
}

function AutomationCardForPRC({ volatileId, event }: AutomationCardProps) {
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [selectedEntityType, setSelectedEntityType] = useState<string | null>(null);

  const { selectedEntityId } = useEntitySelection();
  const { nodes } = useRootCauseTopologyDataContext();
  const selectedNodeInfo = selectedEntityId ? nodes[selectedEntityId] : undefined;

  const trigger = useTrigger({ event });
  const userActions = useScoredActions({ event, trigger, type: 'default', selectedDescription });
  const ootbActions = useScoredActions({ event, trigger, type: 'watsonx', selectedEntityType });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions });
  const ootbRecommendedActions = useAIRecommendedScoredActions({ actions: ootbActions });
  const isRootCause = selectedNodeInfo?.tags?.has('RCA');
  useEffect(() => {
    if (selectedEntityId && nodes && selectedNodeInfo && isRootCause) {
      setSelectedDescription(selectedNodeInfo.label);
      setSelectedEntityType(selectedNodeInfo.entityType);
    }
  }, [selectedEntityId, nodes, selectedNodeInfo, isRootCause]);

  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card>
          <RecommendedActions
            event={event}
            volatileId={volatileId}
            trigger={trigger}
            recommendedActions={recommendedActions}
            ootbRecommendedActions={ootbRecommendedActions}
            setSelectedDescription={setSelectedDescription}
            setSelectedEntityType={setSelectedEntityType}
            selectedDescription={selectedDescription}
            selectedEntityType={selectedEntityType}
          />
        </Card>
      </Col>
    </Row>
  );
}

function AutomationCardWithOptimization({ volatileId, event }: AutomationCardProps) {
  return (
    <>
      <AutomationCardForPRC volatileId={volatileId} event={event} />
    </>
  );
}

export default function AutomationCardWrapper({ volatileId, event }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCardWithOptimization volatileId={volatileId} event={event} />;
}
