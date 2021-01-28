/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { empty } from '@instana/observables';
import rpt from 'prop-types';
import React from 'react';

import { getSingleNumberMetricId, getSparkChartTimeSeriesMetricId } from 'in-new-components/AnalyzeView/metricIds';
import { joinExpressions, removeTopLevelFilters } from 'in-new-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { addGroupingCriteriaToFormModel } from 'in-new-components/AnalyzeView/StateManagement';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import FacetedSearch from 'in-new-components/AnalyzeView/FacetedSearch';
import { getFormatter } from 'in-services/formatters/backendFormatter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Header from 'in-new-components/QueryBuilder/components/Header';
import { getSparkChartGranularity } from 'in-applications/metrics';
import IconButton from 'in-new-components/IconButton/IconButton';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { emptyObject, emptyArray } from 'in-services/fixedObjects';
import KeyValue from 'in-new-components/lists/KeyValue';
import Tooltip from 'in-components/Tooltip/Tooltip';
import useTimeConfig from 'in-hooks/useTimeConfig';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './GroupedView.mless';

export default function GroupedAnalyzeView(props) {
  const {
    getData,
    groupBy,
    orderBy,
    onOrderByChange,
    backendQueryModel,
    formModel,
    getHrefToUngroupedView,
    UngroupedView,
    getLabel,
    isValid,
    fields,
    metricCatalog,
    dataSource,
    facetedSearchItems,
    getFacetedSearchSuggestions,
    onTagFilterExpressionChange,
    getHrefWithTagFilterExpression,
    groupedViewConfiguration,
    getItemLabel,
    itemlabelColumnId
  } = props;
  const timeConfig = useTimeConfig();

  const sparkChartGranularity = getSparkChartGranularity(timeConfig);

  const columnDefinitions = [
    ...(props.columnDefinitions || emptyArray),

    {
      id: itemlabelColumnId,
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
    },

    ...fields
      .map(field => {
        if (field.type !== metricType) {
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
      .filter(Boolean),
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

  const backendMetrics = fields
    .filter(({ type }) => type === metricType)
    .reduce((accumulator, metric) => {
      accumulator[getSingleNumberMetricId(metric)] = metric;
      accumulator[getSparkChartTimeSeriesMetricId(metric)] = {
        ...metric,
        granularity: sparkChartGranularity
      };
      return accumulator;
    }, {});

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
      isValid ? getData({ timeConfig, orderBy, backendQueryModel, groupBy, cursor, metrics: backendMetrics }) : empty,
    [isValid, timeConfig, groupBy, backendQueryModel, orderBy]
  );

  const isLoading = props.isLoading || progress?.loading;
  const hasErrors = !isLoading && errors?.length > 0;
  const hasItems = !isLoading && items.length > 0;

  const getNewTagFilterExpression = ({ add = emptyArray, remove = emptyArray }) =>
    joinExpressions({
      expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
    });

  return (
    <>
      <Header
        {...props}
        hitName="Group"
        totalHits={totalHits}
        totalRepresentedItemCount={totalRepresentedItemCount}
        order={orderBy}
        setOrder={onOrderByChange}
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
                    <ColumnizedContent
                      {...props}
                      columnDefinitions={columnDefinitions}
                      href={getHrefToUngroupedView(label)}
                      item={item}
                      progress={progress}
                      timeConfig={timeConfig}
                      sparkChartGranularity={sparkChartGranularity}
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
