/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { ButtonGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { useSegmentTracker } from 'in-automation/tracker';
import { createStore } from 'in-stores/store';
import { t } from 'in-i18n';

interface AutomationCardButtonGroupProps {
  recommendedActionsCount: number | undefined;
  actionHistoryCount: number | undefined;
  hasRCA?: boolean;
}

type ButtonKey = 'recommendedActions' | 'actionHistory';

const initialActiveKey: ButtonKey = 'recommendedActions';

const activeKeyStore = createStore<ButtonKey>({
  name: 'in-automation/AutomationCard/activeKeyStore',
  initialValue: initialActiveKey,
  isGlobal: false
});
const activeKey$ = activeKeyStore.observable;

export const useActiveKey = () => useObservable(activeKey$, []) ?? initialActiveKey;

export const setActiveKey = (activeKey: ButtonKey) => activeKeyStore.mutateTo(activeKey);

export default function AutomationCardButtonGroup({
  recommendedActionsCount,
  actionHistoryCount,
  hasRCA = false
}: AutomationCardButtonGroupProps) {
  const activeKey = useActiveKey();
  useEffect(() => {
    if (hasRCA) setActiveKey('actionHistory');
  }, [hasRCA]);
  const { recommendedActionsTabClickTrackerSegment } = useSegmentTracker();

  const buttonProps = [
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
  if (hasRCA) {
    return null;
  }

  return <ButtonGroup buttonPropsList={buttonProps} activeKey={activeKey} segmented />;
}
