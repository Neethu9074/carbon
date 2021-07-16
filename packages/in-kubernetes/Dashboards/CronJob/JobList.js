/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { SvgIconSizes } from '@instana/components';
import { LiLoadMore } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { KeyValue } from '@instana/components';
import { Stack } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import getKubernetesJobs from 'in-subscription/kubernetes/getKubernetesJobs';
import { retrievalSize } from 'in-components/AnalyzeView/UngroupedView';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { isLoading, hasError } from 'in-services/util/result';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { formatDuration } from 'in-services/formatters/date';
import Pods from 'in-kubernetes/Dashboards/CronJob/PodList';
import { getHistoricMetric } from 'in-stores/metric';
import Tooltip from '../../../in-components/Tooltip';
import SearchInput from 'in-components/SearchInput';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-kubernetes/Dashboards/CronJob/CronJob.mless';

const pathSegment = '/cronjob';

const statusToColour = {
  Completed: theme.lib.colors.success,
  Running: theme.lib.colors.success,
  Failed: theme.lib.colors.failure,
  Unknown: theme.lib.colors.N400
};

const sortOptions = [
  { label: 'name', value: 'name' },
  { label: 'age', value: 'age' },
  { label: 'status', value: 'status' }
];

const urlStateDefinition = {
  bind: [
    {
      path: pathSegment,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: pathSegment,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: pathSegment,
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: intParser
    },
    {
      path: pathSegment,
      name: 'query',
      as: 'query',
      initialState: ''
    }
  ],
  resets: [
    {
      bind: [
        {
          path: pathSegment,
          name: 'orderBy'
        },
        {
          path: pathSegment,
          name: 'orderDirection'
        }
      ],
      reset: { page: 1 }
    }
  ]
};

const notFoundComponent = (
  <CenterAlignmentColumn>
    <EntityPageMainNotification
      icon="lib_missing_data"
      title="No jobs available"
      explanation="No jobs available"
      changeExplanation={() => 'There were no jobs retrieved for the selected time range.'}
    />
  </CenterAlignmentColumn>
);

const labelColumnDefinitions = [
  {
    id: 'health',
    width: '1.7rem',
    getContent({ item }) {
      return (
        <div className={locals.center}>
          <HealthDot color={statusToColour[item?.status || statusToColour.Unknown]} iconSize={SvgIconSizes.xxs} />
        </div>
      );
    }
  },
  {
    id: 'name',
    getContent({ item }) {
      return <KeyValue label={t('in-kubernetes:dashboards.name')} value={item.label} accentuated />;
    }
  }
];

const columnDefinitions = [
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
  // There are two loading related boolean variables here: isLoading and isInitialLoading.
  // where as isInitialLoading is only True when data is loaded for the first time
  // isLoading is true when data is loaded for the first time and when MORE data is loading
  // Here UL is returned if there is previously loaded data otherwise LoadingIndicator is returned
  const [{ orderBy, orderDirection, page, query }, setUrlState] = useUrlState(urlStateDefinition);
  return (
    <Stack>
      <HorizontalFlexWrapper className={locals.header}>
        <div>
          <SortingConfigurator
            options={sortOptions}
            orderBy={{
              by: orderBy,
              direction: orderDirection
            }}
            onChange={({ by, direction }) =>
              setUrlState({
                orderBy: by,
                orderDirection: direction
              })
            }
          />
        </div>
        <SearchInput query={query} onChange={updatedQuery => setUrlState({ query: updatedQuery, page: 1 })} />
      </HorizontalFlexWrapper>
      <JobList {...props} page={page} query={query} orderBy={orderBy} orderDirection={orderDirection} />
    </Stack>
  );
}

function JobList({ query, cronJobId, timeConfig, orderBy, orderDirection, props }) {
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

  const loading = isLoading(jobsResult);
  const hasErrors = hasError(jobsResult);
  const items = jobsResult.items;
  const isInitialLoading = isLoading(jobsResult) && jobsResult.items?.length === 0;

  if (isInitialLoading) {
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={jobsResult.errors} />;
  }
  return (
    <Ul>
      {items.map((item, index) => (
        <Li
          key={`${item.label}-${index}`}
          toggleContentOnRowClick
          renderNestedContent={() => <Pods {...props} jobId={item.job.id} />}
          roundShadow
        >
          <div className={locals.list}>
            <div className={locals.label}>
              <ColumnizedContent {...props} columnDefinitions={labelColumnDefinitions} item={item.job} />
            </div>
            <div className={locals.metrics}>
              <ColumnizedContent columnDefinitions={columnDefinitions} {...item} />
            </div>
          </div>
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
  cursor = null,
  retrievalSize = 20,
  orderBy = 'age',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  namespaceId,
  cronJobId
}) {
  return getKubernetesJobs({
    pagination: {
      cursor,
      retrievalSize
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

function HealthDot({ color = theme.lib.colors.fadedTeal800, explanation, iconSize, className }) {
  const dot = (
    <div
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor: color
      }}
      className={classNames({ [locals.dot]: true, [className]: true })}
    />
  );
  if (!explanation) {
    return dot;
  }
  return <Tooltip content={explanation}>{dot}</Tooltip>;
}

HealthDot.propTypes = {
  color: PropTypes.string,
  explanation: PropTypes.string,
  iconSize: PropTypes.number,
  className: PropTypes.string
};
