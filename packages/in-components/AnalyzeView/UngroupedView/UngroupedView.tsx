/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

// @ts-expect-error export needs types
import { empty } from '@instana/observables';
import { Stack } from '@instana/components';

// @ts-expect-error needs TS migration
import MetricAndSortingConfigurator from 'in-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
// @ts-expect-error needs TS migration
import { getAvailableMetrics } from 'in-components/AnalyzeView/metrics';
import GroupedViewOnlyIndicator from 'in-components/AnalyzeView/UngroupedView/GroupedViewOnlyIndicator';
import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './UngroupedView.mless';

export const retrievalSize = 20;

export default function UngroupedView(props: UngroupedViewProps) {
  const backendQueryModelWithFacets = useStableObjectInstance(props.backendQueryModelWithFacets);

  const {
    dataSource,
    detailId,
    DetailView,
    Sidebar,
    fixedFields,
    getData,
    isValid,
    metricCatalog,
    onOrderByChange,
    onSelectableFieldsChange,
    orderBy,
    Presenter,
    selectableFields,
    SplitScreenListItemContent,
    useCursorPaginationStrategy,
    withoutHeader,
    hideMetricAndSortingConfigurator,
    Chart,
    withOverflow = false,
    CustomHeaderActions,
    ungroupedViewConfiguration
  } = props;

  const timeConfig = useTimeConfig();
  const fields = [...fixedFields, ...selectableFields];

  const backendMetrics = useStableObjectInstance(
    fields.filter(({ type }) => type === metricType).map(metric => metric.metricId)
  );
  const { trackUa2MetricAdded, trackUa2MetricRemoved } = useAnalyzeTracker();

  const cursorPaginationState = (useCursorPaginationStrategy ?? useCursorPagination)(
    params =>
      isValid
        ? getData({
            timeConfig,
            orderBy,
            backendQueryModel: backendQueryModelWithFacets,
            dataSource,
            metrics: backendMetrics,
            ...params
          })
        : empty,
    [isValid, timeConfig, backendQueryModelWithFacets, orderBy, dataSource, backendMetrics, getData]
  );
  const {
    items,
    errors,
    progress,
    totalHits,
    totalRepresentedItemCount,
    totalRetainedItemCount,
    adjustedWindowSize,
    resultPrecisionDetails
  } = cursorPaginationState;

  const isLoading = props.isLoading || progress?.loading;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasErrors = !props.isLoading && errors?.length > 0;
  // We deliberately use props.isLoading, because we do not want to remove all loaded entries
  // from the list when clicking "load more".
  const hasItems = !props.isLoading && items.length > 0;

  if (!props.isLoading && !isValid) {
    return null;
  }

  if (detailId) {
    return (
      <DetailView
        {...props}
        {...cursorPaginationState}
        isLoading={isLoading}
        hasErrors={hasErrors}
        hasItems={hasItems}
        ListItemContent={SplitScreenListItemContent}
      />
    );
  }

  const availableMetrics = getAvailableMetrics({
    metricCatalog,
    fixedFields
  });

  const headerActions =
    CustomHeaderActions ||
    (props => <MetricAndSortingConfigurator {...props} metricOptions={props.availableMetrics} />);

  return (
    <Stack direction={'horizontal'} gap={'disabled'}>
      {Sidebar && <Sidebar {...props} />}
      <div className={classNames(locals.resultContainer, { [locals.withOverflow]: withOverflow })}>
        {Chart && <Chart {...props} />}
        {!withoutHeader && (
          <Header
            {...props}
            order={orderBy}
            totalHits={totalHits}
            totalRepresentedItemCount={totalRepresentedItemCount}
            totalRetainedItemCount={totalRetainedItemCount}
            hasErrors={hasErrors}
            isLoading={isLoading}
            setOrder={onOrderByChange}
            dataSource={dataSource}
            availableMetrics={hideMetricAndSortingConfigurator ? [] : availableMetrics}
            metrics={selectableFields.map(m => ({ metric: m.metricId, aggregation: m.aggregationId }))}
            setMetrics={metrics =>
              onSelectableFieldsChange(
                metrics.map(metric => ({
                  // Converting metrics to fields by adding the type
                  metricId: metric.metric,
                  aggregationId: metric.aggregation,
                  type: metricType
                }))
              )
            }
            withAdjustedWindowSizeTooltip={Boolean(adjustedWindowSize)}
            tracking={{
              onMetricAdded: ({ metric, aggregation }) => trackUa2MetricAdded({ dataSource, metric, aggregation }),
              onMetricAggregationChanged: ({ metric, aggregation }) =>
                trackUa2MetricAdded({ dataSource, metric, aggregation }),
              onMetricRemoved: ({ metric, aggregation }) => trackUa2MetricRemoved({ dataSource, metric, aggregation })
            }}
            renderHistoricDataIndicator={resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE'}
            CustomHeaderActions={headerActions}
            MetricConfiguratorHint={({ metricId }) => (
              <GroupedViewOnlyIndicator
                metricId={metricId}
                hasRawValue={ungroupedViewConfiguration.metricFieldExtractors?.hasRawValue}
                metricCatalog={metricCatalog}
              />
            )}
          />
        )}
        <Presenter
          {...props}
          isLoading={isLoading}
          hasErrors={hasErrors}
          hasItems={hasItems}
          {...cursorPaginationState}
        />
      </div>
    </Stack>
  );
}
