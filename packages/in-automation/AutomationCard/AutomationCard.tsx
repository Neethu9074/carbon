/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Event, VolatileId } from '@instana/types';
import { Card, Spacer } from '@instana/components';

import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import AutomationCardButtonGroup, { useActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
  hasRCA?: boolean;
}

function AutomationCard({ volatileId, event, hasRCA = false }: AutomationCardProps) {
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
            hasRCA={hasRCA}
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
              {!hasRCA && <ActionHistoryTable eventId={event.id} />}
              {hasRCA && (
                <ActionHistoryTable eventId={event.id} title={t('in-automation:actionHistory.incidentActionHistory')} />
              )}
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default function AutomationCardWrapper({ volatileId, event, hasRCA = false }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCard volatileId={volatileId} event={event} hasRCA={hasRCA} />;
}
