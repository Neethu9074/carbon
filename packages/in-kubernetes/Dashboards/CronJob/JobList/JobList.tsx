/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KubernetesQueryFilter, OrderDirection } from '@instana/types';
import { Ul } from '@instana/components';

import JobListItems from 'in-kubernetes/Dashboards/CronJob/JobList/components/JobListItems';
import { retrievalSize } from 'in-components/AnalyzeView/UngroupedView/UngroupedView';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadMore from 'in-kubernetes/Dashboards/CronJob/JobList/components/LoadMore';
import Loading from 'in-kubernetes/Dashboards/CronJob/JobList/components/Loading';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { isLoading as getIsLoading, hasError } from 'in-services/util/result';
import { getTableData } from 'in-kubernetes/Dashboards/CronJob/JobList/utils';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { t } from 'in-i18n';

interface JobListProps extends KubernetesQueryFilter {
  query: string;
  orderBy: string;
  orderDirection: OrderDirection;
}

export default function JobList(props: JobListProps) {
  const { query, cronJobId, timeConfig, orderBy, orderDirection, podId: lastAccessedPodId } = props;

  const jobsResult = useCursorPagination(
    ({ cursor }) =>
      getTableData({
        query,
        timeConfig,
        cursor,
        orderBy,
        orderDirection,
        retrievalSize: retrievalSize,
        cronJobId
      }),
    [timeConfig]
  );

  const { items: jobsResultItems, errors, canLoadMore, loadMore } = jobsResult;
  const isLoading = getIsLoading(jobsResult);
  const hasErrors = hasError(jobsResult);
  const isInitialLoading = getIsLoading(jobsResult) && jobsResultItems?.length === 0;
  const totalItems = jobsResultItems?.length;

  if (isInitialLoading) {
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} size="regular" />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={errors} />;
  }

  return (
    <Ul>
      <JobListItems items={jobsResultItems} lastAccessedPodId={lastAccessedPodId} podProps={props} />
      <LoadMore canLoadMore={canLoadMore} loadMore={loadMore as () => {}} />
      <Loading isLoading={isLoading} numSkeletonRows={totalItems ? 1 : 3} totalItems={totalItems} />
    </Ul>
  );
}
