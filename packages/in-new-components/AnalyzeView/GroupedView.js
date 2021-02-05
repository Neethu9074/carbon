/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { empty } from '@instana/observables';
import React, { useEffect } from 'react';
import rpt from 'prop-types';
import { t } from 'in-i18n';

import {
  getAvailableMetrics,
  getSingleNumberMetricId,
  getSparkChartTimeSeriesMetricId,
  groupName
} from 'in-new-components/AnalyzeView/metrics';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { custom as customType, metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { addGroupingCriteriaToFormModel } from 'in-new-components/AnalyzeView/StateManagement';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import FacetedSearch from 'in-new-components/AnalyzeView/FacetedSearch';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import useStableObjectIntance from 'in-hooks/useStableObjectIntance';
import { getSparkChartGranularity } from 'in-applications/metrics';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import KeyValue from 'in-new-components/lists/KeyValue';
import { aggregationLabels } from 'in-stores/metric';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SvgIcon from 'in-components/SvgIcon';

import locals from './GroupedView.mless';

export default function GroupedAnalyzeView(props) {
  const {
    getData,
    groupBy,
    orderByGroups,
    onOrderByGroupsChange,
    backendQueryModel,
    formModel,
    getHrefToUngroupedView,
    UngroupedView,
    getLabel,
    isValid,
    selectableFields,
    fixedFields,
    onSelectableFieldsChange,
    metricCatalog,
    metricCatalogFilter,
    dataSource,
    facetedSearchItems,
    getFacetedSearchSuggestions,
    onTagFilterExpressionChange,
    getHrefWithTagFilterExpression,
    groupedViewConfiguration,
    getItemLabel,
    itemlabelColumnId,
    onChartableDataSeriesChange,
    withoutSorting = false
  } = props;
  const timeConfig = useTimeConfig();
  const fields = [...fixedFields, ...selectableFields];

  const sparkChartGranularity = getSparkChartGranularity(timeConfig);

  const labelColumnDefinitions = [
    {
      id: itemlabelColumnId,
      width: '30%',
      getContent({ item, groupBy: { groupbyTag }, groupingTagCatalog }) {
        let label = groupbyTag;
        const tagDefinition = groupingTagCatalog.tagsByName[groupbyTag];
        if (tagDefinition) {
          label = tagDefinition.label;

          label = (
            <span className={locals.groupLabel}>
              {tagDefinition.path
                .slice(0, tagDefinition.path.length - 1)
                .map(node => node.label)
                .join(' ')}
              <SvgIcon className={locals.arrowRight} type="lib_arrow_drop_right" />
              {tagDefinition.path[tagDefinition.path.length - 1].label}
            </span>
          );
        }
        return <KeyValue label={label} customValue={getItemLabel(item)} />;
      }
    }
  ];

  const columnDefinitions = [
    ...(props.columnDefinitions || emptyArray),

    ...fields
      .map(field => {
        if (field.type === customType) {
          return groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId];
        }

        return {
          shrink: false,
          width: '16rem',
          minWidth: '9rem',
          getContent({ item: { metrics }, timeConfig, progress, sparkChartGranularity }) {
            const metricDefinition = metricCatalog.find(({ metricId }) => metricId === field.metric);
            return (
              <div className={locals.sparkChartWrapper}>
                <SparkChart
                  loading={progress?.loading}
                  rollup={sparkChartGranularity}
                  timeConfig={timeConfig}
                  aggregation={field.aggregation}
                  metrics={metrics[getSparkChartTimeSeriesMetricId(field)]}
                  metric={metrics[getSingleNumberMetricId(field)]}
                  tooltipFormatter={getFormatter(metricDefinition?.formatter)}
                  label={metricDefinition?.label ?? field.metric}
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

  const actionColumnDefinitions = [
    {
      id: 'focus',
      width: '3rem',
      shrink: false,
      getContent({ href }) {
        return (
          <Tooltip content={t('in-new-components:analyze.focusOnGroup')}>
            <IconButton type="lib_actions_filter" href={href} />
          </Tooltip>
        );
      }
    }
  ];

  const backendMetrics = useStableObjectIntance(
    fields
      .filter(({ type }) => type === metricType)
      .reduce((accumulator, metric) => {
        accumulator[getSingleNumberMetricId(metric)] = metric;
        accumulator[getSparkChartTimeSeriesMetricId(metric)] = {
          ...metric,
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
    totalRepresentedItemCount
  } = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getData({ timeConfig, orderByGroups, backendQueryModel, groupBy, cursor, metrics: backendMetrics })
        : empty,
    [isValid, timeConfig, groupBy, backendQueryModel, orderByGroups, backendMetrics]
  );

  const isLoading = props.isLoading || progress?.loading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !isLoading && items.length > 0;

  const getNewTagFilterExpression = ({ add = emptyArray, remove = emptyArray }) =>
    joinExpressions({
      expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
    });

  useEffect(() => {
    if (isLoading || hasErrors) {
      return;
    }

    onChartableDataSeriesChange(
      items.slice(0, 5).map(item => ({
        label: getItemLabel(item),
        formModel: addGroupingCriteriaToFormModel(groupBy, getItemLabel(item), formModel)
      }))
    );
  }, [items, isLoading, hasErrors, onChartableDataSeriesChange, formModel, getItemLabel, groupBy]);

  const sortOptions = fields
    .map(field => {
      const value = groupedViewConfiguration.getOrderById && groupedViewConfiguration.getOrderById({ field: field });
      if (value == null) {
        return;
      }
      if (field.type === customType) {
        const fieldLabel = groupedViewConfiguration.customFieldRenderingInstructions[field.customFieldId]?.label;
        return { value, label: fieldLabel ?? field.customFieldId };
      }
      const metricDefinition = metricCatalog?.find(({ metricId }) => metricId === field.metric);
      const metricLabel = metricDefinition?.label ?? field.metric;
      const aggregationLabel = aggregationLabels[field.aggregation] ?? field.aggregation;
      return { value, label: `${metricLabel} (${aggregationLabel})` };
    })
    .filter(Boolean);
  // Allow to sort by group name
  sortOptions.unshift({ value: groupName, label: t('in-new-components:analyze.groupName') });

  const availableMetrics = getAvailableMetrics({ metricCatalog, metricCatalogFilter, fixedFields });

  return (
    <>
      <Header
        {...props}
        hitName={t('in-new-components:analyzeView.groupedViewHeader')}
        sortOptions={withoutSorting ? undefined : sortOptions}
        availableMetrics={availableMetrics}
        metrics={selectableFields}
        totalHits={totalHits}
        totalRepresentedItemCount={totalRepresentedItemCount}
        order={orderByGroups}
        setOrder={onOrderByGroupsChange}
        setMetrics={metrics =>
          onSelectableFieldsChange(
            metrics.map(metric => ({
              // Converting metrics to fields by adding the type
              ...metric,
              type: metricType
            }))
          )
        }
      />
      <div className={locals.facetedSearchResultContainer}>
        {facetedSearchItems && facetedSearchItems.length > 0 && (
          <FacetedSearch
            facetedSearchItems={facetedSearchItems}
            formModel={formModel}
            onFacetedSearchChange={updateAddAndRemove =>
              onTagFilterExpressionChange(getNewTagFilterExpression(updateAddAndRemove))
            }
            getUpdatedTagExpressionHref={updateAddAndRemove =>
              getHrefWithTagFilterExpression(getNewTagFilterExpression(updateAddAndRemove))
            }
            dataSource={dataSource}
            isValid={isValid}
            getSuggestions={tag =>
              getFacetedSearchSuggestions({
                timeConfig,
                backendQueryModel,
                metricKey: 'facetedSearchMetric',
                group: {
                  groupbyTag: tag
                },
                dataSource
              })
            }
          />
        )}
        <div className={locals.resultContainer}>
          {hasErrors && <ErrorList errors={errors} />}
          {hasItems && (
            <Ul space="xsmall">
              {items.map(item => {
                const label = getLabel(item);
                return (
                  <Li
                    key={label}
                    toggleContentOnRowClick
                    renderNestedContent={() => {
                      const formModelForUnGroupedView = addGroupingCriteriaToFormModel(groupBy, label, formModel);
                      return (
                        // tagFilterExpression / backendQueryModel must be separately memoized based on hash
                        // within the ungrouped view.
                        <UngroupedView
                          {...props}
                          withoutHeader
                          groupLabel={label}
                          groupBy={emptyObject}
                          backendQueryModel={toBackendQueryModel(formModelForUnGroupedView)}
                          formModel={formModelForUnGroupedView}
                          facetedSearchItems={[]}
                        />
                      );
                    }}
                  >
                    <div className={locals.list}>
                      <ColumnizedContent {...props} columnDefinitions={labelColumnDefinitions} item={item} />
                      <div className={locals.metrics}>
                        <ColumnizedContent
                          {...props}
                          columnDefinitions={columnDefinitions}
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
              {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
            </Ul>
          )}
          {isLoading && <LoadingList numSkeletonRows={3} />}
          {!isLoading && !hasItems && <NoDataAvailable height={240} />}
        </div>
      </div>
    </>
  );
}

GroupedAnalyzeView.propTypes = {
  ...childrenArgsAsPropTypes,

  getData: rpt.func.isRequired,
  getLabel: rpt.func.isRequired,
  itemName: rpt.string.isRequired,
  CustomHeaderActions: rpt.elementType,
  columnDefinitions: rpt.array,
  UngroupedView: rpt.elementType.isRequired
};
