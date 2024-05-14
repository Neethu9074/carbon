/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Card, Spacer, Stack } from '@instana/components';
import { ButtonGroup } from '@instana/components';

import useScoredActions, { useRecommendedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import RecommendedActions from 'in-automation/AutomationCard/RecommendedActions';
import AutomationPolicies from 'in-automation/AutomationCard/AutomationPolicies';
import { recommendedActionsTabClickTracker } from 'in-automation/tracker';
import usePolicies from 'in-automation/AutomationCard/usePolicies';
import { actionAutomationEnabled } from 'in-services/featureFlags';
import useHistory from 'in-automation/AutomationCard/useHistory';
import useTrigger from 'in-automation/AutomationCard/useTrigger';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { Event, VolatileId } from 'in-types';
import { role } from 'in-stores/user';
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
  const buttonProps = [
    {
      text: t('in-automation:automationPoliciesWithCount', { count: policyCount ?? '' }),
      key: 'automationPolicies',
      onClick: () => setActiveKey('automationPolicies')
    },
    {
      text: t('in-automation:recommendedActionsWithCount', { count: recommendedActionsCount ?? '' }),
      key: 'recommendedActions',
      onClick: () => {
        setActiveKey('recommendedActions');
        recommendedActionsTabClickTracker();
      }
    }
  ];

  if (role?.canViewAutomationActionInstances) {
    buttonProps.push({
      text: t('in-automation:actionHistory.actionHistoryWithCount', { count: actionHistoryCount ?? '' }),
      key: 'actionHistory',
      onClick: () => setActiveKey('actionHistory')
    });
  }

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
  const actions = useScoredActions({ event, trigger });
  const recommendedActions = useRecommendedScoredActions({ actions, policies });

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
              actions={actions}
              policies={policies}
              trigger={trigger}
            />
          )}
          {activeKey === 'recommendedActions' && (
            <RecommendedActions
              event={event}
              volatileId={volatileId}
              setActiveKey={setActiveKey}
              recommendedActions={recommendedActions}
            />
          )}
          {activeKey === 'actionHistory' && role?.canViewAutomationActionInstances && (
            <ActionHistoryTable eventId={event.id} />
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default function AutomationCardWrapper({ volatileId, event }: AutomationCardProps) {
  if (!actionAutomationEnabled) return null;
  return <AutomationCard volatileId={volatileId} event={event} />;
}
