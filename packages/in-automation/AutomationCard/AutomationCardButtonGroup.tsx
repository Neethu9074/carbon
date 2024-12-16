/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { useSegmentTracker } from 'in-automation/tracker';
import { createStore } from 'in-stores/store';
import { t } from 'in-i18n';

interface AutomationCardButtonGroupProps {
  policyCount: number | undefined;
  recommendedActionsCount: number | undefined;
  actionHistoryCount: number | undefined;
}

type ButtonKey = 'automationPolicies' | 'recommendedActions' | 'actionHistory';

const initialActiveKey: ButtonKey = 'automationPolicies';

const activeKeyStore = createStore<ButtonKey>({
  name: 'in-automation/AutomationCard/activeKeyStore',
  initialValue: initialActiveKey,
  isGlobal: false
});
const activeKey$ = activeKeyStore.observable;

export const useActiveKey = () => useObservable(activeKey$, []) ?? initialActiveKey;

export const setActiveKey = (activeKey: ButtonKey) => activeKeyStore.mutateTo(activeKey);

export default function AutomationCardButtonGroup({
  policyCount,
  recommendedActionsCount,
  actionHistoryCount
}: AutomationCardButtonGroupProps) {
  const activeKey = useActiveKey();
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

  return <ButtonGroup buttonPropsList={buttonProps} activeKey={activeKey} segmented />;
}
