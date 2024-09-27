/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import {
  actionCategoryColumn,
  nameColumn,
  impactedServicesColumn
} from 'in-automation/ResourceOptimization/columnDefinitions';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { usePaginatedResourceOptimizations } from 'in-automation/AutomationCard/useScoredActions';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { RecommendedAction, Result } from 'in-types';
import { t } from 'in-i18n';

const pathSegment = '/RecommendedOptimizations';
const matrixPrefix = '';

const columnDefinitions: ColumnDefinition<RecommendedAction, RecommendedOptimizationsTableProps>[] = [
  nameColumn,
  impactedServicesColumn,
  actionCategoryColumn
];

interface RecommendedOptimizationsTableProps extends ServerTablePresenterProps<RecommendedAction> {}

interface RecommendedOptimizationsProps {
  recommendedActions: Result<RecommendedAction[]>;
  totalRecommendedActions: number;
}

export default function RecommendedOptimizations({
  recommendedActions,
  totalRecommendedActions
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

  const totalHits = totalRecommendedActions;

  //TODO update with modal code
  const handleRowClick = () => {};

  return (
    <ServerTablePresenter<RecommendedAction, RecommendedOptimizationsTableProps>
      columnDefinitions={columnDefinitions}
      fixedLayout
      leftHeader={
        <Typography variant="heading-300">
          {result?.progress?.loading
            ? t('in-automation:recommendedOptimizations')
            : t('in-automation:recommendedOptimizationsWithCount', { count: totalHits })}
        </Typography>
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
      onRowClick={handleRowClick}
      tableInCard={false}
    />
  );
}
