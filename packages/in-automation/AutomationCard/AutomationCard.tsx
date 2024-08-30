/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect } from 'react';

import { Card, Spacer, Stack } from '@instana/components';
import { ButtonGroup } from '@instana/components';

import useScoredActions, {
  useUserRecommendedScoredActions,
  useAIRecommendedScoredActions
} from 'in-automation/AutomationCard/useScoredActions';
import { recommendedActionsTabClickTracker, useSegmentTracker } from 'in-automation/tracker';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import AutomationPolicies from 'in-automation/AutomationCard/AutomationPolicies';
import usePolicies from 'in-automation/AutomationCard/usePolicies';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { hasAutomationAccess } from 'in-stores/permission';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { Event, VolatileId } from 'in-types';
import { t } from 'in-i18n';

export type ButtonKey = 'automationPolicies' | 'recommendedActions' | 'actionHistory';
export type SetActiveKey = (str: ButtonKey) => void;

interface AutomationCardButtonGroupProps {
  activeKey: ButtonKey;
  setActiveKey: SetActiveKey;
  policyCount: number | undefined;
  recommendedActionsCount: number | undefined;
  actionHistoryCount: number | undefined;
}

function AutomationCardButtonGroup({
  activeKey,
  setActiveKey,
  policyCount,
  recommendedActionsCount,
  actionHistoryCount
}: AutomationCardButtonGroupProps) {
  const { recommendedActionsTabClickTrackerSegment } = useSegmentTracker();
  const buttonProps = [
    {
      text:
        policyCount !== undefined
          ? t('in-automation:automationPoliciesWithCount', { count: policyCount })
          : t('in-automation:automationPolicies'),
      key: 'automationPolicies',
      onClick: () => setActiveKey('automationPolicies')
    },
    {
      text:
        recommendedActionsCount !== undefined
          ? t('in-automation:recommendedActionsWithCount', { count: recommendedActionsCount })
          : t('in-automation:recommendedActions'),
      key: 'recommendedActions',
      onClick: () => {
        setActiveKey('recommendedActions');
        recommendedActionsTabClickTrackerSegment();
        recommendedActionsTabClickTracker();
      }
    },
    {
      text:
        actionHistoryCount !== undefined
          ? t('in-automation:actionHistory.actionHistoryWithCount', { count: actionHistoryCount })
          : t('in-automation:actionHistory.actionHistory'),
      key: 'actionHistory',
      onClick: () => setActiveKey('actionHistory')
    }
  ];

  return (
    <Stack gap="xxsmall">
      <ButtonGroup buttonPropsList={buttonProps} activeKey={activeKey} segmented />
    </Stack>
  );
}

interface AutomationCardProps {
  volatileId: VolatileId;
  event: Event;
}

function AutomationCard({ volatileId, event }: AutomationCardProps) {
  const [activeKey, setActiveKey] = useState<ButtonKey>('automationPolicies');
  const policies = usePolicies({ event });
  const historyCount = useHistory({ eventId: event.id });
  const trigger = useTrigger({ event });
  const userActions = useScoredActions({ event, trigger, type: 'default' });
  const watsonxActions = useScoredActions({ event, trigger, type: 'watsonx' });
  const recommendedActions = useUserRecommendedScoredActions({ actions: userActions, policies });
  const aiRecommendedScoredActions = useAIRecommendedScoredActions({ actions: watsonxActions, policies });
  useEffect(() => {
    if (policies?.data?.length === 0) {
      setActiveKey('recommendedActions');
    }
  }, [policies]);
  return (
    <Row withoutSideMargin>
      <Col xs>
        <Card>
          <AutomationCardButtonGroup
            activeKey={activeKey}
            setActiveKey={setActiveKey}
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
              setActiveKey={setActiveKey}
            />
          )}
          {activeKey === 'recommendedActions' && (
            <RecommendedActions
              event={event}
              volatileId={volatileId}
              setActiveKey={setActiveKey}
              recommendedActions={recommendedActions}
              aiRecommendedScoredActions={aiRecommendedScoredActions}
            />
          )}
          {activeKey === 'actionHistory' && <ActionHistoryTable eventId={event.id} />}
        </Card>
      </Col>
    </Row>
  );
}

export default function AutomationCardWrapper({ volatileId, event }: AutomationCardProps) {
  if (!hasAutomationAccess) return null;
  return <AutomationCard volatileId={volatileId} event={event} />;
}
