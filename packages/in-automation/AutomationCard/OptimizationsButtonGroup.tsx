/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { createStore } from 'in-stores/store';
import { t } from 'in-i18n';

interface OptimizationsButtonGroupProps {
  recommendedOptimizationsCount: number | undefined;
  optimizationHistoryCount: number | undefined;
}

type OptimizationsButtonKey = 'recommendedOptimizations' | 'optimizationHistory';

const initialActiveKey: OptimizationsButtonKey = 'recommendedOptimizations';

const activeKeyStore = createStore<OptimizationsButtonKey>({
  name: 'in-automation/AutomationCard/OptimizationsButtonGroup/activeKeyStore',
  initialValue: initialActiveKey,
  isGlobal: false
});
const activeKey$ = activeKeyStore.observable;

export const useActiveKey = () => useObservable(activeKey$, []) ?? initialActiveKey;

export const setActiveKey = (activeKey: OptimizationsButtonKey) => activeKeyStore.mutateTo(activeKey);

export default function OptimizationsButtonGroup({
  recommendedOptimizationsCount,
  optimizationHistoryCount
}: OptimizationsButtonGroupProps) {
  const activeKey = useActiveKey();

  const buttonProps = [
    {
      text:
        recommendedOptimizationsCount !== undefined
          ? t('in-automation:recommendedOptimizationsWithCount', { count: recommendedOptimizationsCount })
          : t('in-automation:recommendedOptimizations'),
      key: 'recommendedOptimizations',
      onClick: () => {
        setActiveKey('recommendedOptimizations');
      }
    },
    {
      text:
        optimizationHistoryCount !== undefined
          ? t('in-automation:resourceOptimization.recommendedActionHistoryWithCount', {
              count: optimizationHistoryCount
            })
          : t('in-automation:resourceOptimization.recommendedActionHistory'),
      key: 'optimizationHistory',
      onClick: () => setActiveKey('optimizationHistory')
    }
  ];

  return <ButtonGroup buttonPropsList={buttonProps} activeKey={activeKey} segmented />;
}
