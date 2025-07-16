/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { RecommendedAction, Result } from '@instana/types';
import { IconButton } from '@instana/components';

import {
  actionCategoryColumn,
  nameColumn,
  impactedApplicationsColumn
} from 'in-automation/ResourceOptimization/columnDefinitions';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { usePaginatedResourceOptimizations } from 'in-automation/ResourceOptimization/useResourceOptimization';
import { useTurboAgentSnapShots } from 'in-automation/ResourceOptimization/useResourceOptimization';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import DetailsModal from 'in-automation/ResourceOptimization/DetailsModal';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

const pathSegment = '/RecommendedOptimizations';
const matrixPrefix = '';

interface RecommendedOptimizationsTableProps extends ServerTablePresenterProps<RecommendedAction> {}

interface RecommendedOptimizationsProps {
  recommendedActions: Result<RecommendedAction[]>;
  totalRecommendedActions: number | undefined;
  onActionClick?: Function;
}

export const turboActionCategoryMap = {
  COMPLIANCE: t('in-automation:turboActionCategories.compliance'),
  PREVENTION: t('in-automation:turboActionCategories.prevention'),
  EFFICIENCY_IMPROVEMENT: t('in-automation:turboActionCategories.efficiency'),
  SAVINGS: t('in-automation:turboActionCategories.savings'),
  PERFORMANCE_ASSURANCE: t('in-automation:turboActionCategories.performance'),
  PERFORMANCE_ASSURANCE_FULL: t('in-automation:turboActionCategories.performance_assurance'),
  EFFICIENCY_IMPROVEMENT_FULL: t('in-automation:turboActionCategories.efficiency_improvement'),
  UNKNOWN: t('in-automation:turboActionCategories.unknown')
};

export default function RecommendedOptimizations({
  recommendedActions,
  totalRecommendedActions,
  onActionClick = () => {}
}: RecommendedOptimizationsProps) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection } = serverTableUrlState;

  const result = usePaginatedResourceOptimizations({
    recommendedActions,
    serverTableUrlState,
    setServerTableUrlState
  });

  const agentSnapShots = useTurboAgentSnapShots();

  const handleOpenModal = (recAction: RecommendedAction) => {
    const currentAction = recommendedActions?.data?.find(x => {
      return x.id === recAction.id;
    });
    const agents = agentSnapShots?.data?.online ?? [];
    onActionClick(currentAction, agents);
    if (currentAction) {
      addActiveDialog(<DetailsModal currentAction={currentAction} agents={agents} />);
    }
  };

  const actionButtonColumn: ColumnDefinition<RecommendedAction, RecommendedOptimizationsTableProps> = {
    id: 'actionButtons',
    label: '',
    sortable: false,
    width: 6,
    getContent(recAction) {
      return (
        <IconButton
          kind="action"
          type="lib_actions_play"
          onClick={() => handleOpenModal(recAction)}
          isWrapperedByTooltip
          iconDescription={t('in-automation:createPolicyWithName', { actionName: recAction.name })}
          align={'left'}
          size="compact"
        />
      );
    }
  };

  const columnDefinitions: ColumnDefinition<RecommendedAction, RecommendedOptimizationsTableProps>[] = [
    nameColumn,
    impactedApplicationsColumn,
    actionCategoryColumn,
    actionButtonColumn
  ];

  const totalHits = totalRecommendedActions ?? 0;

  return (
    <ServerTablePresenter<RecommendedAction, RecommendedOptimizationsTableProps>
      columnDefinitions={columnDefinitions}
      fixedLayout
      leftHeader={null}
      cardTitle={
        result?.progress?.loading
          ? t('in-automation:recommendedOptimizations')
          : t('in-automation:recommendedOptimizationsWithCount', { count: totalHits })
      }
      onChange={setServerTableUrlState}
      orderBy={orderBy}
      orderDirection={orderDirection}
      searchMaxWidth={180}
      page={page}
      pageSize={pageSize}
      result={result}
      rightHeader={null}
      searchPlaceholder={t('in-automation:searchOptimizations')}
      tableInCard={false}
    />
  );
}
