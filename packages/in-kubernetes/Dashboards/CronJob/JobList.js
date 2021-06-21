/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { LiLoadMore } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { KeyValue } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesJobs from 'in-subscription/kubernetes/getKubernetesJobs';
import { retrievalSize } from 'in-components/AnalyzeView/UngroupedView';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { formatDuration } from 'in-services/formatters/date';
import HealthDot from 'in-components/health/HealthDot';
import { getHistoricMetric } from 'in-stores/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

const statusToSeverity = {
  Completed: 0,
  Running: 1.1,
  Failed: 10
};

const notFoundComponent = (
  <CenterAlignmentColumn>
    <EntityPageMainNotification
      icon="lib_missing_data"
      title="No jobs available"
      explanation="No jobs   available"
      changeExplanation={() => 'There were no jobs retrieved for the selected time range.'}
    />
  </CenterAlignmentColumn>
);

const columnDefinitions = [
  {
    id: 'health',
    width: '1rem',
    getContent(item) {
      return <HealthDot severity={statusToSeverity[item.status] || statusToSeverity.Running} iconSize={10} />;
    }
  },
  {
    id: 'name',
    getContent(item) {
      return <KeyValue label={t('in-kubernetes:dashboards.name')} value={item.job.label} accentuated />;
    }
  },
  {
    id: 'status',
    width: '10rem',
    getContent(item) {
      return <KeyValue label={t('in-kubernetes:dashboards.status')} value={item.job.status} theme="blue" accentuated />;
    }
  },
  {
    id: 'age',
    width: '10rem',
    getContent(item) {
      return (
        <KeyValue
          label={t('in-kubernetes:dashboards.age')}
          value={formatDuration(item.job?.age)}
          theme="blue"
          accentuated
        />
      );
    }
  },
  {
    id: 'pending',
    width: '10rem',
    getContent(item) {
      return <PodMetrics snapshotId={item.job.id} metric="status.failed" label={t('in-kubernetes:pod.pending')} />;
    }
  },
  {
    id: 'active',
    width: '10rem',
    getContent(item) {
      return <PodMetrics snapshotId={item.job.id} metric="status.active" label={t('in-kubernetes:pod.active')} />;
    }
  },
  {
    id: 'complete',
    width: '10rem',
    getContent(item) {
      return <PodMetrics snapshotId={item.job.id} metric="status.succeeded" label={t('in-kubernetes:pod.completed')} />;
    }
  }
];

export default function Jobs(props) {
  const { timeConfig } = props;
  const { canLoadMore, progress, loadMore, errors, items } = useCursorPagination(
    ({ cursor }) =>
      getTableData({
        timeConfig: timeConfig,
        page: cursor,
        pageSize: retrievalSize,
        cronJobId: props.cronJobId
      }),
    [timeConfig]
  );
  const isLoading = progress?.loading;
  const isInitialLoading = progress?.loading && items?.length === 0;
  const hasErrors = errors?.length > 0;
  if (isInitialLoading) {
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={errors} />;
  }
  return (
    <Ul>
      {items.map(item => (
        <Li noAlternatingBg borderRadius="medium" toggleContentOnRowClick highlightOpenState={false} key={item.label}>
          <ColumnizedContent columnDefinitions={columnDefinitions} {...item} />
        </Li>
      ))}
      {canLoadMore && <LiLoadMore loadMore={loadMore} />}
      {isLoading && <LoadingList numSkeletonRows={items?.length ? 1 : 3} />}
      {!isLoading && !items?.length && notFoundComponent}
    </Ul>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'age',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  namespaceId,
  cronJobId
}) {
  return getKubernetesJobs({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      namespaceId,
      cronJobId,
      timeConfig
    },
    granularity: getInfraGranularity(timeConfig)
  });
}

function PodMetrics({ snapshotId, metric, label }) {
  const timeConfig = useTimeConfig();
  const podsPending = useObservable(
    getHistoricMetric({
      snapshotId,
      metric: metric,
      timeConfig: timeConfig
    })
      .map(v => v[1])
      .distinct(),
    []
  );
  return <KeyValue label={label} value={podsPending || valueMissingPlaceholder} theme="blue" accentuated />;
}
