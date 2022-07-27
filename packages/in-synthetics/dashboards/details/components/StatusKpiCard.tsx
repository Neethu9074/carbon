/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { dummyTestResultList } from 'in-synthetics/utils/constants';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import theme from 'in-themes';

interface StatusKpiCardProps {
  testId: string;
  resultId: string;
}

export default function StatusKpiCard({ testId, resultId }: StatusKpiCardProps) {
  const timeConfig = useTimeConfig();
  let page = 1;
  let pageSize = 1;
  const height = 160;
  let content;
  let color = theme.lib.colors.success;

  let tagFilters = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      stringValue: resultId,
      name: 'id',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [number]>(
      () =>
        getTestResultList({
          pagination: {
            page,
            pageSize
          },
          order: { by: 'status', direction: 'DESC' },
          syntheticMetrics: ['status'],
          filter: {
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false
          },
          // @ts-expect-error tagFilters do not fully match the TagFilter type
          tagFilters: tagFilters
        }),
      [0]
    ) || dummyTestResultList;

  if (resultList.progress.loading) {
    return (
      <KpiCard
        title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')}
        value={<LoadingIndicator text={t('in-components:topListCard.loadingData')} height={height} size="l" />}
      />
    );
  } else if (getStatus(resultList) === 0) {
    content = t('in-synthetics:dashboard.detailsPage.failedResult');
    color = theme.lib.colors.failure;
  } else {
    content = t('in-synthetics:dashboard.detailsPage.successResult');
  }

  return <KpiCard title={t('in-synthetics:dashboard.detailsPage.statusKpiCard')} value={content} color={color} />;
}

function getStatus(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return get(resultList.data?.items[0], ['metrics', 'status', 0, 1], 0);
}
