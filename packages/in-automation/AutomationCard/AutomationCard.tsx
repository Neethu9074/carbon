/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Event, VolatileId } from '@instana/types';
import { Card, Spacer } from '@instana/components';

// import AutomationPolicies from 'in-automation/AutomationCard/AutomationPolicies';
// import usePolicies from 'in-automation/AutomationCard/usePolicies';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import AutomationCardButtonGroup, { useActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
}

function AutomationCard({ volatileId, event }: AutomationCardProps) {
  const activeKey = useActiveKey();
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

export default function AutomationCardWrapper({ volatileId, event }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCard volatileId={volatileId} event={event} />;
}
