/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { SvgIconSizes } from '@instana/components';
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
import { isLoading, hasError } from 'in-services/util/result';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { formatDuration } from 'in-services/formatters/date';
import Pods from 'in-kubernetes/Dashboards/CronJob/PodList';
import HealthDot from 'in-components/health/HealthDot';
import { getHistoricMetric } from 'in-stores/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/CronJob/CronJob.mless';

const statusToSeverity = {
  Completed: 0,
  Running: 1.1,
  Failed: 10,
  Unknown: 6
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
    getContent({ status }) {
      return (
        <HealthDot
          severity={status ? statusToSeverity[status] : statusToSeverity.Unknown}
          iconSize={SvgIconSizes.xxs}
        />
      );
    }
  },
  {
    id: 'name',
    getContent({ job }) {
      return <KeyValue label={t('in-kubernetes:dashboards.name')} value={job.label} accentuated />;
    }
  },
  {
    id: 'status',
    width: '10rem',
    getContent({ job }) {
      return <KeyValue label={t('in-kubernetes:dashboards.status')} value={job.status} theme="blue" accentuated />;
    }
  },
  {
    id: 'age',
    width: '10rem',
    getContent({ job }) {
      return (
        <KeyValue label={t('in-kubernetes:dashboards.age')} value={formatDuration(job?.age)} theme="blue" accentuated />
      );
    }
  },
  {
    id: 'pending',
    width: '10rem',
    getContent({ job }) {
      return <PodMetrics snapshotId={job.id} metric="status.failed" label={t('in-kubernetes:pod.pending')} />;
    }
  },
  {
    id: 'active',
    width: '10rem',
    getContent({ job }) {
      return <PodMetrics snapshotId={job.id} metric="status.active" label={t('in-kubernetes:pod.active')} />;
    }
  },
  {
    id: 'complete',
    width: '10rem',
    getContent({ job }) {
      return <PodMetrics snapshotId={job.id} metric="status.succeeded" label={t('in-kubernetes:pod.completed')} />;
    }
  }
];

export default function Jobs(props) {
  const { timeConfig, cronJobId } = props;
  const jobsResult = useCursorPagination(
    ({ cursor }) =>
      getTableData({
        timeConfig,
        page: cursor,
        pageSize: retrievalSize,
        cronJobId
      }),
    [timeConfig]
  );

  const loading = isLoading(jobsResult);
  const hasErrors = hasError(jobsResult);
  const items = jobsResult.items;
  const isInitialLoading = isLoading(jobsResult) && jobsResult.items?.length === 0;

  // There are two loading related boolean variables here: isLoading and isInitialLoading.
  // where as isInitialLoading is only True when data is loaded for the first time
  // isLoading is true when data is loaded for the first time and when MORE data is loading
  // Here UL is returned if there is previously loaded data otherwise LoadingIndicator is returned

  if (isInitialLoading) {
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={jobsResult.errors} />;
  }

  return (
    <Ul>
      {items.map(item => (
        <Li
          borderRadius="medium"
          className={locals.listItem}
          highlightOpenState={false}
          key={item.label}
          renderNestedContent={() => <Pods {...props} jobId={item.job.id} />}
          toggleContentOnRowClick
          noAlternatingBg
        >
          <ColumnizedContent columnDefinitions={columnDefinitions} {...item} />
        </Li>
      ))}
      {jobsResult.canLoadMore && <LiLoadMore loadMore={jobsResult.loadMore} />}
      {loading && <LoadingList numSkeletonRows={items?.length ? 1 : 3} />}
      {!loading && !items?.length && notFoundComponent}
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
