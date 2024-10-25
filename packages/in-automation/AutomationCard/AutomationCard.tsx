/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card, Spacer } from '@instana/components';
import { Event, VolatileId } from '@instana/types';

import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import {
  useResourceOptimization,
  useTurboRecommendedActions
} from 'in-automation/ResourceOptimization/useResourceOptimization';
import AutomationCardButtonGroup, { useActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import RecommendedOptimizations from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import AutomationPolicies from 'in-automation/AutomationCard/AutomationPolicies';
import { resourceOptimizationActionsEnabled } from 'in-services/featureFlags';
import usePolicies from 'in-automation/AutomationCard/usePolicies';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
}

function AutomationCard({ volatileId, event }: AutomationCardProps) {
  const activeKey = useActiveKey();
  const policies = usePolicies({ event });
  const historyCount = useHistory({ eventId: event.id });
  const trigger = useTrigger({ event });
  const userActions = useScoredActions({ event, trigger, type: 'default' });
  const ootbActions = useScoredActions({ event, trigger, type: 'watsonx' });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions, policies });
  const ootbRecommendedActions = useAIRecommendedScoredActions({ actions: ootbActions, policies });
  const recommendedOptimizations = useResourceOptimization({ event, actionCategory: 'PERFORMANCE_ASSURANCE' });
  const turboRecommendedActions = useTurboRecommendedActions(recommendedOptimizations);
  return (
    <>
      {resourceOptimizationActionsEnabled && (
        <Row withoutSideMargin>
          <Col xs>
            <Card>
              <RecommendedOptimizations
                recommendedActions={turboRecommendedActions}
                totalRecommendedActions={recommendedOptimizations?.data?.totalRecommendedActionsCount!}
              />
            </Card>
          </Col>
        </Row>
      )}
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
              />
            )}
            {activeKey === 'actionHistory' && <ActionHistoryTable eventId={event.id} />}
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default function AutomationCardWrapper({ volatileId, event }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCard volatileId={volatileId} event={event} />;
}
