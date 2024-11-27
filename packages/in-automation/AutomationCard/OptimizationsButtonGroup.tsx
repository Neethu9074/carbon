/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect } from 'react';

import { ButtonGroup } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { refreshHistory } from 'in-automation/AutomationCard/useHistory';
import { createStore } from 'in-stores/store';
import { t } from 'in-i18n';

interface OptimizationsButtonGroupProps {
  recommendedOptimizationsCount: number | undefined;
  optimizationHistoryCount: number | undefined;
}

type OptimizationsButtonKey = 'recommended' | 'history';

const initialActiveKey: OptimizationsButtonKey = 'recommended';

const activeKeyStore = createStore<OptimizationsButtonKey>({
  name: 'in-automation/AutomationCard/OptimizationsButtonGroup/activeKeyStore',
  initialValue: initialActiveKey,
  isGlobal: false
});
const activeKey$ = activeKeyStore.observable;

export const useActiveOptimizationsKey = () => useObservable(activeKey$, []) ?? initialActiveKey;

export const setActiveKey = (activeKey: OptimizationsButtonKey) => activeKeyStore.mutateTo(activeKey);

export default function OptimizationsButtonGroup({
  recommendedOptimizationsCount,
  optimizationHistoryCount
}: OptimizationsButtonGroupProps) {
  const activeKey = useActiveOptimizationsKey();
  const { location } = useNavigation();
  useEffect(() => {
    const loc = location.pathname.lastIndexOf('/');
    if (loc != -1) {
      const relpath = location.pathname.substring(loc);
      const pageActiveKey = location.matrix[relpath]
        ? location.matrix[relpath]['resourceActionsTab']
        : initialActiveKey;
      setActiveKey(pageActiveKey as unknown as OptimizationsButtonKey);
    }
  }, [location.matrix, location.pathname]);

  const buttonProps = [
    {
      text:
        recommendedOptimizationsCount !== undefined
          ? t('in-automation:recommendedOptimizationsWithCount', { count: recommendedOptimizationsCount })
          : t('in-automation:recommendedOptimizations'),
      key: 'recommended',
      onClick: () => {
        setActiveKey('recommended');
      }
    },
    {
      text:
        optimizationHistoryCount !== undefined
          ? t('in-automation:resourceOptimization.recommendedActionHistoryWithCount', {
              count: optimizationHistoryCount
            })
          : t('in-automation:resourceOptimization.recommendedActionHistory'),
      key: 'history',
      onClick: () => {
        setActiveKey('history');
        refreshHistory();
      }
    }
  ];

  return <ButtonGroup buttonPropsList={buttonProps} activeKey={activeKey} segmented />;
}
