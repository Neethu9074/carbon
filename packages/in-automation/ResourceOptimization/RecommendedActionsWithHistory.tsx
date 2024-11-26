/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ResourceOptimization, Result } from '@instana/types';

import OptimizationsButtonGroup, {
  useActiveOptimizationsKey
} from 'in-automation/AutomationCard/OptimizationsButtonGroup';
import { useTurboRecommendedActions } from 'in-automation/ResourceOptimization/useResourceOptimization';
import RecommendedOptimizations from 'in-automation/ResourceOptimization/RecommendedOptimizations';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import useActionHistoryCount from 'in-automation/AutomationCard/useHistory';
import { t } from 'in-i18n';

interface RecommendedActionsWithHistoryProps {
  recommendedActions: Result<ResourceOptimization>;
  onActionClick?: Function;
}

export default function RecommendedActionsWithHistory({
  recommendedActions,
  onActionClick = () => {}
}: RecommendedActionsWithHistoryProps) {
  const activeOptimizationsKey = useActiveOptimizationsKey();
  const historyCount = useActionHistoryCount({
    types: ['EXTERNAL'],
    actionStatuses: ['SUCCESS', 'FAILED', 'IN_PROGRESS', 'STATUS_UNKNOWN', 'SUBMITTED', 'TIMEOUT']
  });
  const turboRecommendedActions = useTurboRecommendedActions(recommendedActions);

  return (
    <>
      <OptimizationsButtonGroup
        recommendedOptimizationsCount={recommendedActions?.data?.totalRecommendedActionsCount!}
        optimizationHistoryCount={historyCount}
      />
      {activeOptimizationsKey === 'recommended' && (
        <RecommendedOptimizations
          recommendedActions={turboRecommendedActions}
          totalRecommendedActions={recommendedActions?.data?.totalRecommendedActionsCount}
          onActionClick={onActionClick}
        />
      )}
      {activeOptimizationsKey === 'history' && (
        <ActionHistoryTable
          customActionTypes={['EXTERNAL']}
          title={t('in-automation:resourceOptimization.recommendedActionHistory')}
          noFilters
          noEvent
        />
      )}
    </>
  );
}
