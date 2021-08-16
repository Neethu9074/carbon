/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { Stack, SvgIcon } from '@instana/components';
import { empty } from '@instana/observables';

import { optionsPropType } from 'in-components/SortingConfigurator/SortingConfigurator';
import { ua2MetricAddedTracker, ua2MetricRemovedTracker } from 'in-components/tracker';
import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getAvailableMetrics } from 'in-components/AnalyzeView/metrics';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './UngroupedView.mless';

export const retrievalSize = 20;
export default function UngroupedAnalyzeView(props) {
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
    withSamplingTooltip,
    ungroupedViewConfiguration,
    hideMetricAndSortingConfigurator,
    Chart
  } = props;

  const timeConfig = useTimeConfig();
  const cursorPaginationState = (useCursorPaginationStrategy ?? useCursorPagination)(
    params =>
      isValid
        ? getData({ timeConfig, orderBy, backendQueryModel: backendQueryModelWithFacets, dataSource, ...params })
        : empty,
    [isValid, timeConfig, backendQueryModelWithFacets, orderBy, dataSource, getData]
  );
  const { items, errors, progress, totalHits, totalRepresentedItemCount, adjustedWindowSize } = cursorPaginationState;

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

  return (
    <Stack direction={'horizontal'} gap={'disabled'}>
      {Sidebar && <Sidebar {...props} />}
      <div className={locals.resultContainer}>
        {Chart && <Chart {...props} />}
        {!withoutHeader && (
          <Header
            {...props}
            order={orderBy}
            totalHits={totalHits}
            totalRepresentedItemCount={totalRepresentedItemCount}
            setOrder={onOrderByChange}
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
            withSamplingTooltip={withSamplingTooltip}
            withAdjustedWindowSizeTooltip={Boolean(adjustedWindowSize)}
            tracking={{
              onMetricAdded: ({ metric, aggregation }) => ua2MetricAddedTracker({ dataSource, metric, aggregation }),
              onMetricAggregationChanged: ({ metric, aggregation }) =>
                ua2MetricAddedTracker({ dataSource, metric, aggregation }),
              onMetricRemoved: ({ metric, aggregation }) => ua2MetricRemovedTracker({ dataSource, metric, aggregation })
            }}
            MetricConfiguratorHint={({ metricId }) => (
              <GroupedViewOnlyIndicator
                metricId={metricId}
                getHasRawValue={ungroupedViewConfiguration.metricFieldExtractors?.hasRawValue}
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

function GroupedViewOnlyIndicator({ metricId, metricCatalog, getHasRawValue }) {
  const metricDefinition = metricCatalog.find(metric => metric.metricId === metricId);
  if (getHasRawValue?.({ metricDefinition })) {
    return null;
  }
  return (
    <Tooltip content={t('in-components:analyze.groupedOnly')} align="bottomRight">
      <SvgIcon type="lib_help_error_help_outline" size="s" className={locals.helpIcon} />
    </Tooltip>
  );
}

UngroupedAnalyzeView.propTypes = {
  ...childrenArgsAsPropTypes,

  getItemName: rpt.func,
  withoutHeader: rpt.bool,
  getData: rpt.func.isRequired,
  getDetailData: rpt.func.isRequired,
  getId: rpt.func.isRequired,
  columnDefinitions: rpt.array.isRequired,
  DetailView: rpt.elementType.isRequired,
  CustomHeaderActions: rpt.elementType,
  sortOptions: optionsPropType,
  Sidebar: rpt.elementType,

  // Will be auto-provided by GroupedView in the relevant scenarios.
  groupLabel: rpt.string
};

export const detailViewProps = {
  ...childrenArgsAsPropTypes,
  getId: rpt.func.isRequired,
  getItemName: rpt.func,

  isLoading: rpt.bool,
  hasErrors: rpt.bool,
  hasItems: rpt.bool,

  items: rpt.array,
  errors: rpt.array,
  progress: rpt.object,
  canLoadMore: rpt.bool,
  loadMore: rpt.func,
  totalHits: rpt.number
};
