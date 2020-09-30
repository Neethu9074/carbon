import React, { useCallback } from 'react';

import { ColumnizedContent, Ul, Li, LoadingSkeletonLi, HorizontalIndicatorLi } from 'in-new-components/lists/List';
import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { type as TAG_FILTER_TYPE } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import InfrastructureList from 'in-infrastructure/Explore/components/InfrastructureList';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import createGetGroupsSubscription from 'in-infrastructure/subscriptions/getGroups';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import CountHeader from 'in-infrastructure/Explore/components/CountHeader';
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { rollupForBeeInstantMetrics } from 'in-stores/metric/beeInstant';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { getLinkToExplore } from 'in-infrastructure/navigation/paths';
import { error as errorType } from 'in-new-components/Message/types';
import { indeterminateProgress } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import { pluginTag } from 'in-infrastructure/Explore/constants';
import useCursorPagination from 'in-hooks/useCursorPagination';
import MoreMenu from 'in-new-components/MoreMenu/MoreMenu';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import KeyValue from 'in-new-components/lists/KeyValue';
import { emptyObject } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SparkChart from 'in-components/SparkChart';
import Message from 'in-new-components/Message';

import locals from './GroupedInfrastructure.mless';

export default function GroupedInfrastructure({
  tagFilterExpression,
  backendQueryModel,
  onChange,
  group,
  type,
  aggregation = 'MEAN'
}) {
  const timeConfig = useTimeConfig();

  const granularity = getGranularity(timeConfig);

  const kpis = getKpis(type);

  const props = useCursorPagination(
    ({ cursor }) => getGroups({ timeConfig, backendQueryModel, group, type, kpis, granularity, aggregation, cursor }),
    [timeConfig, backendQueryModel, group, type]
  );

  return (
    <Presenter
      tagFilterExpression={tagFilterExpression}
      backendQueryModel={backendQueryModel}
      granularity={granularity}
      aggregation={aggregation}
      timeConfig={timeConfig}
      onChange={onChange}
      group={group}
      type={type}
      kpis={kpis}
      {...props}
    />
  );
}

function Presenter({
  totalRepresentedItemCount,
  tagFilterExpression,
  backendQueryModel,
  aggregation,
  canLoadMore,
  granularity,
  timeConfig,
  totalHits,
  onChange,
  loadMore,
  progress,
  errors,
  group,
  items,
  kpis,
  type
}) {
  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;
  const getParamsForGroup = useCallback(
    item => ({
      group: emptyObject,
      tagFilterExpression: joinExpressions(tagFilterExpression, toTagFilters(item.tags))
    }),
    [tagFilterExpression]
  );
  const columnDefinitions = columns({
    groupBy: [group.groupbyTag],
    type,
    onChange,
    getParamsForGroup,
    kpis,
    timeConfig,
    granularity,
    aggregation
  });

  return (
    <>
      {totalHits > 0 && (
        <CountHeader
          totalHits={totalHits}
          totalRepresentedItemCount={totalRepresentedItemCount}
          hitName="Group"
          itemName="Result"
        />
      )}
      <Ul space="xsmall">
        {items.map((item, rowIndex) => (
          <Li
            key={rowIndex}
            noAlternatingBg
            borderRadius="medium"
            toggleContentOnRowClick
            highlightOpenState={false}
            renderNestedContent={() => (
              <ExpandedGroup group={item} backendQueryModel={backendQueryModel} timeConfig={timeConfig} type={type} />
            )}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} group={item} />
          </Li>
        ))}
        {isLoading && <HorizontalIndicatorLi progress={indeterminateProgress} />}
        {isLoading && <LoadingSkeletonLi />}
        {hasErrors &&
          getUniqueErrors(errors).map(error => (
            <Li key={error}>
              <Message className={locals.message} type={errorType} small>
                {error}
              </Message>
            </Li>
          ))}
        {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
      </Ul>
      {!isLoading && items.length === 0 && <NoDataAvailable height={240} />}
    </>
  );
}

function columns({ groupBy, type, getParamsForGroup, kpis, timeConfig, granularity, aggregation }) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? snapshotDefinition.pluginName.plural : 'Count';
  return [
    {
      width: '3rem',
      getContent({ group }) {
        const icon = getGroupIcon(group);
        return <IconButton key="someKey1" type={icon} />;
      }
    }
  ]
    .concat(
      groupBy.map((groupKey, i) => ({
        width: getColumnWidth(groupBy, i),
        getContent({ group }) {
          const value = getGroupTagValue(group, groupKey);
          return <KeyValue label={groupKey} value={value} accentuated />;
        }
      }))
    )
    .concat([
      {
        width: '8rem',
        getContent({ group }) {
          return <KeyValue label={countLabel} value={group.count} theme="blue" accentuated />;
        }
      }
    ])
    .concat(
      kpis.map(({ label, metric, formatter = String }) => ({
        width: '12rem',
        getContent({ group }) {
          const kpi = group.metrics[metric + 'Agg'];
          return (
            <SparkChart
              rollup={granularity}
              timeConfig={timeConfig}
              metrics={group.metrics[metric]}
              aggregation={aggregation}
              tooltipFormatter={formatter}
              horizontalMetricValue={kpi ? formatter(kpi[0][1]) : '--'}
              label={label}
            />
          );
        }
      }))
    )
    .concat([
      {
        width: '3rem',
        getContent({ group }) {
          return (
            <MoreMenu kind="subtle">
              <MoreMenuContent groupParams={getParamsForGroup(group)} />
            </MoreMenu>
          );
        }
      }
    ]);
}

function getColumnWidth(groupBy, index) {
  if (index !== groupBy.length - 1) {
    return 50 / groupBy.length + 'rem';
  }
}

function getGroups({ timeConfig, backendQueryModel, group, cursor, type, kpis, granularity, aggregation }) {
  return createGetGroupsSubscription({
    filter: {
      timeConfig,
      tagFilterExpression: backendQueryModel
    },
    pagination: {
      cursor,
      retrievalSize: 20
    },
    groupBy: [group.groupbyTag],
    type,
    metrics: Object.fromEntries(
      kpis.flatMap(({ metric }) => [
        [
          metric,
          {
            metric,
            granularity,
            aggregation
          }
        ],
        [metric + 'Agg', { metric, granularity: timeConfig.windowSize, aggregation }]
      ])
    )
  });
}

function MoreMenuContent({ groupParams }) {
  return (
    <Ul>
      <Li href$={getLinkToExplore(groupParams)}>Filter down using this group</Li>
    </Ul>
  );
}

function ExpandedGroup({ group, backendQueryModel, timeConfig, type }) {
  return (
    <InfrastructureList
      backendQueryModel={addTagsToBackendModel(backendQueryModel, group.tags)}
      timeConfig={timeConfig}
      type={type}
      retrievalSize={5}
      numSkeletonRows={Math.min(group.count, 5)}
    />
  );
}

function addTagsToBackendModel(backendQueryModel, tags) {
  return addTagFilters(backendQueryModel, toTagFilters(tags));
}

function toTagFilters(tags) {
  return Object.entries(tags).map(([key, value]) => ({
    type: TAG_FILTER_TYPE,
    operator: EQUALS,
    name: key,
    value
  }));
}

const defaultGroupIcon = 'lib_views_tag';

function getGroupPlugin(group) {
  const plugin = group.tags[pluginTag];
  return plugin ? getOptionalSnapshotDefinition(plugin) : null;
}

function getGroupIcon(group) {
  const plugin = getGroupPlugin(group);
  return plugin ? `plugin:${plugin.plugin}` : defaultGroupIcon;
}

function getGroupTagValue(group, key) {
  if (key === pluginTag) {
    const plugin = getGroupPlugin(group);
    return plugin && plugin.pluginName ? plugin.pluginName.singular : group.tags[key];
  } else {
    return group.tags[key];
  }
}

function getGranularity(timeConfig) {
  const dataPoints = 10;

  return rollupForBeeInstantMetrics(timeConfig.windowSize / dataPoints);
}

function getKpis(type) {
  // hack for beeinstant not having derived metrics at the moment
  if (type === 'host') {
    return [
      {
        label: 'CPU (user)',
        metric: 'cpu.user',
        formatter: percentageZeroDecimalPlaces
      },
      {
        label: 'Memory Free',
        metric: 'memory.free',
        formatter: bytesTwoDecimalPlaces
      }
    ];
  }

  return getKpiDefinitions(type);
}
