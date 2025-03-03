/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import rpt from 'prop-types';

import {
  ColumnizedContent,
  KeyValue,
  Li,
  LiHorizontalIndicator,
  LiLoadMore,
  Stack,
  SvgIcon,
  Ul,
  IconButton
} from '@instana/components';
import { Tooltip } from '@instana/components';
import { empty } from '@instana/observables';

import {
  getAvailableMetrics,
  getSingleNumberMetricId,
  getSparkChartTimeSeriesMetricId,
  groupName
} from 'in-components/AnalyzeView/metrics';
import { addGroupingCriteriaToFormModel, childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import MetricAndSortingConfigurator from 'in-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import { BOOLEAN, KEY_NUMBER_PAIR, KEY_VALUE_PAIR } from 'in-components/QueryBuilder/tagFilter/types';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { or } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { getLabel as defaultGetLabel, GROUP_COLORS } from 'in-components/AnalyzeView/utils.ts';
import { getFormatter as getBackendFormatter } from 'in-services/formatters/backendFormatter';
import { joinExpressions, TAG } from 'in-components/QueryBuilder/transformation/formModel';
import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import { EQUALS, NOT_EMPTY } from 'in-components/QueryBuilder/tagFilter/operators';
import { NO_VALUE, UNSPECIFIED } from 'in-analyze/components/GroupedTraces/Group';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { getSparkChartGranularity } from 'in-applications/metrics';
import Header from 'in-components/QueryBuilder/components/Header';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getFormatter } from 'in-stores/metric/formatters';
import { aggregationLabels } from 'in-stores/metric';
import { identity } from 'in-services/util/function';
import { scrollToTop } from 'in-services/util/dom';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './GroupedView.mless';

export default function GroupedView(props) {
  const {
    backendQueryModelWithFacets,
    getData,
    groupBy,
    orderByGroups,
    onOrderByGroupsChange,
    formModel,
    formModelWithFacets,
    getHrefToUngroupedView,
    UngroupedView,
    Sidebar,
    getLabel = defaultGetLabel,
    isValid,
    selectableFields,
    fixedFields,
    onSelectableFieldsChange,
    metricCatalog,
    dataSource,
    groupedViewConfiguration,
    getCustomMetricUiFormatterName,
    getOrderByGroupId,
    itemlabelColumnId,
    onChartableDataSeriesChange,
    withResultsInGroups,
    withoutSorting = false,
    withoutChartGroupMarkers = false,
    groupingTagCatalog,
    Chart,
    customLatencyUiFormatterName,
    CustomHeaderActions,
    getCustomGroupingTagFilter,
    tracker
  } = props;
  const timeConfig = useTimeConfig();
  const fields = [...fixedFields, ...selectableFields];

  const getColor = props.getColor ?? defaultColorFunction;
  const showChartGroupMarkers = !withoutChartGroupMarkers;
  const groupIcon =
    useMemo(() => {
      if (groupingTagCatalog != null) {
        const tagDefinition = enrichTagCatalog(groupingTagCatalog).tagsByName[groupBy.groupbyTag];
        if (tagDefinition?.path?.length > 0) {
          return tagDefinition.path[tagDefinition.path.length - 1].icon;
        }
      }
      return null;
    }, [groupingTagCatalog, groupBy]) ?? 'lib_views_tag';

  const labelColumnDefinitions = labelColumns({
    itemlabelColumnId,
    getLabel,
    getColor,
    getCustomGroupLabel: groupedViewConfiguration.getCustomGroupLabel,
    showChartGroupMarkers,
    groupIcon
  });
  const metricColumnDefinitions = metricColumns({
    columnDefinitions: props.columnDefinitions,
    fields,
    groupedViewConfiguration,
    getCustomMetricUiFormatterName,
    metricCatalog,
    customLatencyUiFormatterName
  });
  const actionColumnDefinitions = actionColumns();

  const sparkChartGranularity = getSparkChartGranularity(timeConfig);
  const backendMetrics = useStableObjectInstance(
    fields
      .filter(({ type }) => type === metricType)
      .reduce((accumulator, metric) => {
        const backendMetric = {
          metric: metric.metricId,
          aggregation: metric.aggregationId
        };
        accumulator[getSingleNumberMetricId(metric)] = backendMetric;
        accumulator[getSparkChartTimeSeriesMetricId(metric)] = {
          ...backendMetric,
          granularity: sparkChartGranularity
        };
        return accumulator;
      }, {})
  );

  const {
    items,
    errors,
    progress,
    canLoadMore,
    loadMore,
    totalHits,
    totalRepresentedItemCount,
    totalRetainedItemCount,
    adjustedWindowSize,
    resultPrecisionDetails
  } = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getData({
            timeConfig,
            orderByGroups,
            backendQueryModel: backendQueryModelWithFacets,
            groupBy,
            cursor,
            dataSource,
            metrics: backendMetrics
          })
        : empty,
    [isValid, timeConfig, groupBy, backendQueryModelWithFacets, orderByGroups, backendMetrics, dataSource, getData]
  );

  const isLoading = props.isLoading || progress?.loading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !props.isLoading && items.length > 0;

  useEffect(() => {
    if (isLoading) {
      onChartableDataSeriesChange(null);
    } else if (hasErrors) {
      onChartableDataSeriesChange([]);
    } else {
      onChartableDataSeriesChange(
        items.slice(0, 5).map((item, idx) => ({
          label: getLabel(item),
          color: getColor(item, idx),
          formModel: addGroupingCriteriaToFormModel(
            groupBy,
            getLabel(item),
            formModelWithFacets,
            groupingTagCatalog,
            getCustomGroupingTagFilter
          )
        }))
      );
    }
  }, [
    items,
    isLoading,
    hasErrors,
    onChartableDataSeriesChange,
    formModelWithFacets,
    getLabel,
    groupBy,
    dataSource,
    groupingTagCatalog,
    getCustomGroupingTagFilter,
    getColor
  ]);

  const sortOptions = fields
    .map(field => {
      const value = getOrderByGroupId({ field: field });
      if (value == null) {
        return;
      }
      if (field.type === customType) {
        const fieldLabel = groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId]?.label;
        return { value, label: fieldLabel ?? field.customFieldId };
      }
      const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
      const metricLabel = metricDefinition?.label ?? field.metricId;
      const aggregationLabel = aggregationLabels[field.aggregationId] ?? field.aggregationId;
      return { value, label: `${metricLabel} (${aggregationLabel})` };
    })
    .filter(Boolean);
  // Allow to sort by group name
  sortOptions.unshift({
    value: groupedViewConfiguration?.orderByGroupName ?? groupName,
    label: t('in-components:analyze.groupName')
  });

  const availableMetrics = getAvailableMetrics({ metricCatalog, fixedFields });

  const excludeMissingGroupingTagFilterExpression = useMemo(() => {
    const groupByTagType = groupingTagCatalog?.tags.find(t => t.name === groupBy.groupbyTag)?.type;
    if (groupByTagType === BOOLEAN) {
      // Boolean tags do not support the NOT_EMPTY operator
      return joinExpressions({
        logicalOperator: or,
        expressions: [tagFilter(groupBy.groupbyTag, EQUALS, true), tagFilter(groupBy.groupbyTag, EQUALS, false)]
      });
    }
    const excludeMissingGroupTagFilter = {
      type: TAG,
      operator: NOT_EMPTY,
      name: groupBy.groupbyTag
    };
    if (groupByTagType === KEY_VALUE_PAIR || groupByTagType === KEY_NUMBER_PAIR) {
      excludeMissingGroupTagFilter.key = groupBy.groupbyTagSecondLevelKey;
    }
    return excludeMissingGroupTagFilter;
  }, [groupBy, groupingTagCatalog]);

  const headerActions =
    CustomHeaderActions ||
    (props => <MetricAndSortingConfigurator {...props} metricOptions={props.availableMetrics} />);
  const { trackUa2MetricAdded, trackUa2MetricRemoved, trackUa2LoadMore } = useAnalyzeTracker();
  return (
    <>
      <Stack direction={'horizontal'} gap={'disabled'}>
        {Sidebar && (
          <Sidebar
            {...props}
            groupbyTag={groupBy.groupbyTag}
            excludeMissingGroupingTagFilterExpression={excludeMissingGroupingTagFilterExpression}
          />
        )}
        <div className={locals.resultContainer}>
          {Chart && <Chart {...props} />}
          <Header
            {...props}
            sortOptions={withoutSorting ? undefined : sortOptions}
            availableMetrics={availableMetrics}
            metrics={selectableFields.map(m => ({ metric: m.metricId, aggregation: m.aggregationId }))}
            totalHits={totalHits}
            totalRepresentedItemCount={totalRepresentedItemCount}
            totalRetainedItemCount={totalRetainedItemCount}
            hasErrors={hasErrors}
            isLoading={isLoading}
            order={orderByGroups}
            setOrder={onOrderByGroupsChange}
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
            withGrouping
            withResultsInGroups={withResultsInGroups}
            withAdjustedWindowSizeTooltip={Boolean(adjustedWindowSize)}
            tracking={{
              onMetricAdded: ({ metric, aggregation }) => trackUa2MetricAdded({ dataSource, metric, aggregation }),
              onMetricAggregationChanged: ({ metric, aggregation }) =>
                trackUa2MetricAdded({ dataSource, metric, aggregation }),
              onMetricRemoved: ({ metric, aggregation }) => trackUa2MetricRemoved({ dataSource, metric, aggregation })
            }}
            renderHistoricDataIndicator={resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE'}
            CustomHeaderActions={headerActions}
          />
          {hasItems && (
            <Ul>
              {items.map((item, index) => {
                const label = getLabel(item);
                const key = `${label}-${index}`;
                return (
                  <Li
                    data-testid="grouped-view-list-item"
                    initiallyOpen={props.selectedGroup === key}
                    key={key}
                    noAlternatingBg
                    toggleContentOnRowClick
                    tracking={tracker}
                    renderNestedContent={() => {
                      const formModelForUnGroupedView = addGroupingCriteriaToFormModel(
                        groupBy,
                        label,
                        formModel,
                        groupingTagCatalog,
                        getCustomGroupingTagFilter
                      );
                      const formModelWithFacetsForUnGroupedView = addGroupingCriteriaToFormModel(
                        groupBy,
                        label,
                        formModelWithFacets,
                        groupingTagCatalog,
                        getCustomGroupingTagFilter
                      );
                      return (
                        // tagFilterExpression / backendQueryModel must be separately memoized based on hash
                        // within the ungrouped view.
                        // Charts and sidebar should not be shown in nested ungrouped views
                        <UngroupedView
                          {...props}
                          withoutHeader
                          groupLabel={label}
                          groupBy={emptyObject}
                          backendQueryModel={toBackendQueryModel(formModelForUnGroupedView)}
                          backendQueryModelWithFacets={toBackendQueryModel(formModelWithFacetsForUnGroupedView)}
                          formModel={formModelForUnGroupedView}
                          formModelWithFacets={formModelWithFacetsForUnGroupedView}
                          facetedSearchItems={[]}
                          withEmbeddedLoadingIndicator
                          withEmbeddedNoDataIndicator
                          withEmbeddedApproximateDataIndicator
                          Chart={null}
                          Sidebar={null}
                          groupKey={key}
                        />
                      );
                    }}
                    roundShadow
                  >
                    <div className={locals.list}>
                      <div className={locals.label}>
                        <ColumnizedContent {...props} columnDefinitions={labelColumnDefinitions} item={item} />
                      </div>
                      <div className={locals.metrics}>
                        <ColumnizedContent
                          {...props}
                          columnDefinitions={metricColumnDefinitions}
                          item={item}
                          progress={progress}
                          timeConfig={timeConfig}
                          sparkChartGranularity={sparkChartGranularity}
                        />
                      </div>
                    </div>
                    <ColumnizedContent
                      columnDefinitions={actionColumnDefinitions}
                      href={getHrefToUngroupedView(label)}
                    />
                  </Li>
                );
              })}
              {canLoadMore && (
                <LiLoadMore
                  loadMore={() => {
                    loadMore();
                    trackUa2LoadMore({
                      dataSource,
                      groupbyTag: groupBy.groupbyTag,
                      groupbyTagSecondLevelKey: groupBy.groupbyTagSecondLevelKey
                    });
                  }}
                />
              )}
              {progress.loading && <LiHorizontalIndicator progress={progress} />}
            </Ul>
          )}
          {isValid && (
            <QueryProgressIndicator progress={{ ...progress, loading: isLoading }} errors={errors} items={items} />
          )}
        </div>
      </Stack>
    </>
  );
}

function labelColumns({
  itemlabelColumnId,
  getLabel,
  getColor,
  getCustomGroupLabel,
  showChartGroupMarkers,
  groupIcon
}) {
  let i = 0;
  return [
    ...(showChartGroupMarkers
      ? [
          {
            width: '1.5rem',
            getContent({ item }) {
              const groupIdx = i++;
              const color = getColor(item, groupIdx);

              if (!color) {
                return null;
              }

              return (
                <div className={locals.center}>
                  <div className={locals.rect} style={{ backgroundColor: color }} />
                </div>
              );
            }
          }
        ]
      : emptyArray),
    {
      width: '2.5rem',
      getContent() {
        return (
          <div className={locals.center}>
            <SvgIcon type={groupIcon} />
          </div>
        );
      }
    },
    {
      id: itemlabelColumnId,
      getContent({ item, groupBy: { groupbyTag, groupbyTagSecondLevelKey }, groupingTagCatalog }) {
        let label = groupbyTag;
        const tagDefinition = groupingTagCatalog.tagsByName[groupbyTag];
        if (tagDefinition) {
          const tagCategory = tagDefinition.path
            .slice(0, tagDefinition.path.length - 1)
            .map(node => node.label)
            .join(' ');
          const tagName = tagDefinition.path[tagDefinition.path.length - 1].label;
          label = groupbyTagSecondLevelKey
            ? `${tagCategory}.${tagName} > ${groupbyTagSecondLevelKey}`
            : `${tagCategory}.${tagName}`;
        }
        return (
          <KeyValue
            label={<span className={locals.groupLabel}>{label}</span>}
            customValue={
              <GroupLabelTooltip
                groupName={getLabel(item)}
                getCustomGroupLabel={getCustomGroupLabel}
                groupbyTag={groupbyTag}
              />
            }
            accentuated
          />
        );
      }
    }
  ];
}

function GroupLabelTooltip({ groupName, getCustomGroupLabel, groupbyTag }) {
  const groupLabel = getCustomGroupLabel ?? identity;
  const label = groupLabel(groupName, groupbyTag) || '-';
  const labelElement = (
    <div
      className={classNames({
        [locals.italic]: groupName === UNSPECIFIED || groupName === NO_VALUE
      })}
    >
      {label}
    </div>
  );

  return label === '-' ? (
    <Tooltip content={t('in-components:analyze.groupNameNotAvailable', { groupbyTag })} align="mousePosition">
      {labelElement}
    </Tooltip>
  ) : (
    labelElement
  );
}

const isNumberFormatter = formatter => formatter === 'NUMBER';
const getDetailedMetricTooltipValueFormatter = (customFormatterId, formatter) => {
  if (customFormatterId != null) {
    return getFormatter(customFormatterId);
  }
  return isNumberFormatter(formatter)
    ? getBackendFormatter(formatter).compact
    : getBackendFormatter(formatter).detailed;
};

const getDetailedMetricTooltipValue = (metric, metricFormatter) => {
  if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    return metricFormatter(metric[0][1]);
  }
  return null;
};

function metricColumns({
  columnDefinitions,
  fields,
  groupedViewConfiguration,
  getCustomMetricUiFormatterName,
  metricCatalog,
  customLatencyUiFormatterName
}) {
  return [
    ...(columnDefinitions || emptyArray),

    ...fields
      .map(field => {
        if (field.type === customType) {
          return groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId];
        }

        const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metricId);
        const customFormatterId = getCustomMetricUiFormatterName?.(field.metricId, field.aggregationId);
        let formatter;
        if (customFormatterId != null) {
          formatter = getFormatter(customFormatterId);
        } else {
          // The width of metric values rendered using NUMBER formatter can vary significantly which may
          // break column alignment, use more dense SI prefix based formatter instead.
          formatter = isNumberFormatter(metricDefinition?.formatter)
            ? withSiPrefixOneDecimalPlace
            : field.metricId === 'latency' && customLatencyUiFormatterName
            ? getBackendFormatter(customLatencyUiFormatterName)
            : getBackendFormatter(metricDefinition?.formatter);
        }
        return {
          shrink: false,
          width: '16rem',
          minWidth: '9rem',
          getContent({ item: { metrics }, timeConfig, progress, sparkChartGranularity }) {
            return (
              <div className={locals.sparkChartWrapper}>
                <SparkChart
                  loading={progress?.loading}
                  rollup={sparkChartGranularity}
                  timeConfig={timeConfig}
                  aggregation={field.aggregationId}
                  metrics={metrics[getSparkChartTimeSeriesMetricId(field)]}
                  metric={metrics[getSingleNumberMetricId(field)]}
                  tooltipFormatter={formatter}
                  customValueTooltip={getDetailedMetricTooltipValue(
                    metrics[getSingleNumberMetricId(field)],
                    getDetailedMetricTooltipValueFormatter(customFormatterId, metricDefinition?.formatter)
                  )}
                  label={metricDefinition?.label ?? field.metricId}
                  valueTheme="blue"
                />
              </div>
            );
          }
        };
      })
      // We may not have a representation for all fields in the grouped view
      .filter(Boolean)
  ];
}

function actionColumns() {
  return [
    {
      id: 'focus',
      width: '3rem',
      shrink: false,
      getContent({ href }) {
        return (
          <Tooltip content={t('in-components:analyze.focusOnGroup')}>
            <IconButton
              type="lib_actions_filter"
              color="var(--ids-color-option-neutral-900)"
              href={href}
              className={locals.focusButton}
              onClick={() => scrollToTop(window)}
            />
          </Tooltip>
        );
      }
    }
  ];
}

function defaultColorFunction(_, index) {
  return GROUP_COLORS[index];
}
GroupedView.propTypes = {
  ...childrenArgsAsPropTypes,

  getData: rpt.func.isRequired,
  getLabel: rpt.func.isRequired,
  getItemName: rpt.func,
  CustomHeaderActions: rpt.elementType,
  columnDefinitions: rpt.array,
  UngroupedView: rpt.elementType.isRequired,
  Sidebar: rpt.elementType
};
