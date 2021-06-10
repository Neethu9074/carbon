/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { empty } from '@instana/observables';

import { joinExpressions, removeTopLevelFilters } from 'in-components/QueryBuilder/transformation/formModel';
import { optionsPropType } from 'in-components/SortingConfigurator/SortingConfigurator';
import { ua2MetricAddedTracker, ua2MetricRemovedTracker } from 'in-components/tracker';
import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getAvailableMetrics } from 'in-components/AnalyzeView/metrics';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import FacetedSearch from 'in-components/AnalyzeView/FacetedSearch';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './UngroupedView.mless';

export const retrievalSize = 20;
export default function UngroupedAnalyzeView(props) {
  const backendQueryModel = useStableObjectInstance(props.backendQueryModel);

  const {
    dataSource,
    detailId,
    DetailView,
    facetedSearchItems,
    fixedFields,
    formModel,
    getData,
    getFacetedSearchSuggestions,
    getHrefToGroupedView,
    getHrefWithTagFilterExpression,
    isValid,
    metricCatalog,
    onFormModelChange,
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
    filteringTagCatalog,
    hideMetricAndSortingConfigurator
  } = props;

  const timeConfig = useTimeConfig();
  const cursorPaginationState = (useCursorPaginationStrategy ?? useCursorPagination)(
    params => (isValid ? getData({ timeConfig, orderBy, backendQueryModel, dataSource, ...params }) : empty),
    [isValid, timeConfig, backendQueryModel, orderBy, dataSource, getData]
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

  const onFacetedSearchChange = ({ add = emptyArray, remove = emptyArray }) =>
    onFormModelChange(
      joinExpressions({
        expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
      })
    );

  const getUpdatedTagExpressionHref = ({ add = emptyArray, remove = emptyArray }) =>
    getHrefWithTagFilterExpression(
      joinExpressions({
        expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
      })
    );

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
    <>
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

      <div className={locals.facetedSearchResultContainer}>
        {facetedSearchItems?.length > 0 && (
          <FacetedSearch
            facetedSearchItems={facetedSearchItems}
            formModel={formModel}
            onFacetedSearchChange={onFacetedSearchChange}
            getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
            getHrefToGroupedView={getHrefToGroupedView}
            dataSource={dataSource}
            isValid={isValid}
            getSuggestions={({ tag, entity }) =>
              getFacetedSearchSuggestions({
                timeConfig,
                backendQueryModel,
                metricKey: 'facetedSearchMetric',
                group: {
                  groupbyTag: tag
                },
                dataSource,
                entity
              })
            }
            tagCatalog={filteringTagCatalog}
          />
        )}
        <div className={locals.resultContainer}>
          <Presenter
            {...props}
            isLoading={isLoading}
            hasErrors={hasErrors}
            hasItems={hasItems}
            {...cursorPaginationState}
          />
        </div>
      </div>
    </>
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
