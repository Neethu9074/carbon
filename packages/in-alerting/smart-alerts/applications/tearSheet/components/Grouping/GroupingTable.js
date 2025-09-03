/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { ContainedList, ContainedListItem, ExpandableSearch } from '@carbon/react';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { debounce, cloneDeep } from 'lodash';

import { Ul, LiLoadMore, LiHorizontalIndicator, Li, ColumnizedContent, SvgIcon, Spacer } from '@instana/components';
import { Button, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  defaultColorFunction,
  getDetailedMetricTooltipValue,
  getDetailedMetricTooltipValueFormatter,
  isNumberFormatter
} from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByHelper';
import {
  PER_AP,
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import {
  getData,
  timeConfig,
  fields
} from 'in-alerting/smart-alerts/applications/tearSheet/hooks/useAlertingGroupsByEvaluationType';
import GroupByKeyValue from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByKeyValue';
import { getSingleNumberMetricId, getSparkChartTimeSeriesMetricId } from 'in-components/AnalyzeView/metrics';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { getDataSourceConfigurations } from 'in-applications/analyze/AnalyzeView2_0/AnalyzeView';
import { getFormatter as getBackendFormatter } from 'in-services/formatters/backendFormatter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { getMetricCatalog } from 'in-applications/api/metricCatalog';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { meanLatencyFixed } from 'in-services/formatters/number';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { noResultObservable } from 'in-services/util/result';
import { getFormatter } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

import locals from './GroupingTable.mless';

// Helper function to create a tag filter for search
function createSearchTagFilter(searchValue, evaluationType) {
  // Determine the tag name based on evaluation type
  let tagName = 'service.name';
  let entity = 'DESTINATION';

  if (evaluationType === PER_AP_ENDPOINT) {
    tagName = 'endpoint.name';
  }

  return {
    type: 'TAG_FILTER',
    name: tagName,
    operator: 'CONTAINS',
    entity: entity,
    value: searchValue
  };
}

// Helper function to modify tagFilterExpression with search term
function getModifiedTagFilterExpression(originalExpression, searchTerm, evaluationType) {
  if (!searchTerm) {
    return originalExpression;
  }

  const clonedExpression = cloneDeep(originalExpression);

  // Create search tag filter
  const searchFilter = createSearchTagFilter(searchTerm, evaluationType);

  // If the original expression is empty or doesn't have elements
  if (!clonedExpression || !clonedExpression.elements || clonedExpression.elements.length === 0) {
    return {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [searchFilter]
    };
  }

  // If the original expression already has an AND operator at the top level
  if (clonedExpression.logicalOperator === 'AND') {
    // Add the search filter to the elements
    clonedExpression.elements.push(searchFilter);
    return clonedExpression;
  }

  // If the original expression has a different operator (like OR)
  // Wrap it in an AND expression with the search filter
  return {
    type: 'EXPRESSION',
    logicalOperator: 'AND',
    elements: [clonedExpression, searchFilter]
  };
}

export default function GroupingTable({
  tagFilterExpression,
  includeInternal,
  includeSynthetic,
  evaluationType,
  form,
  updateForm,
  pagination,
  setPagination,
  granularity
}) {
  const metricDefinitionByEvaluationType = getMetricDefinitionByEvaluationType(evaluationType);

  const [prevItems, setPrevItems] = useState([]);
  const [prevTotalHits, setPrevTotalHits] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const originalTagFilterExpressionRef = useRef(tagFilterExpression);

  // Create a debounced function for API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce(value => {
      setSearchTerm(value);
    }, 700),
    [setSearchTerm]
  );

  // Handle search input changes - update UI immediately but debounce API calls
  const handleSearchChange = useCallback(
    e => {
      const value = e.target.value;
      // Update UI immediately
      setInputValue(value);
      // Debounce the actual API call
      debouncedSetSearchTerm(value);
    },
    [debouncedSetSearchTerm]
  );

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
          granularity
        };
        return accumulator;
      }, {})
  );

  const hiddenCalls = useEffect(() => {
    return { includeInternal: form.get('includeInternal').value, includeSynthetic: form.get('includeSynthetic').value };
  }, [form]);

  const dataSourceConfigurations = useMemo(
    () => getDataSourceConfigurations({ hiddenCalls, onChangeHiddenCalls: () => {} }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hiddenCalls]
  );

  const { groupedView, getCustomMetricUiFormatterName, metricCatalogTransformer } = dataSourceConfigurations['calls'];

  const metricCatalogResult =
    useObservable(() => getMetricCatalog?.() || noResultObservable(), [getMetricCatalog]) ?? pendingResult;

  const metricCatalog = useMemo(() => {
    let catalog = metricCatalogResult?.data;
    if (metricCatalogTransformer != null) {
      return catalog?.map(metricCatalogTransformer).filter(Boolean);
    }
    return catalog;
  }, [metricCatalogResult, metricCatalogTransformer]);

  const metricColumnDefinitions = metricColumns({
    fields,
    groupedViewConfiguration: groupedView,
    getCustomMetricUiFormatterName,
    metricCatalog,
    customLatencyUiFormatterName: metricDefinitionByEvaluationType.customLatencyUiFormatterName
  });

  const labelColumnDefinitions = labelColumns({
    itemlabelColumnId: metricDefinitionByEvaluationType.itemlabelColumnId,
    getLabel,
    getColor: defaultColorFunction,
    getCustomGroupLabel: '',
    showChartGroupMarkers: false,
    groupIcon: metricDefinitionByEvaluationType.groupIcon,
    groupbyTag: metricDefinitionByEvaluationType.groupbyTag
  });

  const APMetricColumnDefinitions = applicationMetricColumns({ fields, timeConfig });

  // Store the original tagFilterExpression when it changes
  useEffect(() => {
    originalTagFilterExpressionRef.current = tagFilterExpression;
  }, [tagFilterExpression]);

  // Create a modified tagFilterExpression based on search term for non-PER_AP evaluation types
  const effectiveTagFilterExpression = useMemo(() => {
    if (evaluationType === PER_AP || !searchTerm) {
      return tagFilterExpression;
    }
    return getModifiedTagFilterExpression(originalTagFilterExpressionRef.current, searchTerm, evaluationType);
  }, [evaluationType, searchTerm, tagFilterExpression]);

  let { items, progress, canLoadMore, loadMore, totalHits } = useCursorPagination(
    ({ cursor }) => {
      return getData({
        includeInternal,
        includeSynthetic,
        tagFilterExpression: effectiveTagFilterExpression,
        timeConfig,
        metrics: backendMetrics,
        cursor,
        metricDefinitionByEvaluationType,
        evaluationType,
        pagination,
        granularity,
        query: evaluationType === PER_AP ? searchTerm : '' // Only use query for PER_AP
      });
    },
    [
      backendMetrics,
      evaluationType,
      pagination,
      includeInternal,
      includeSynthetic,
      effectiveTagFilterExpression,
      timeConfig,
      searchTerm
    ]
  );

  useEffect(() => {
    const evaluationCount = form.get('hiddenFields').get('evaluationGroupByCount').value;
    if (totalHits) {
      updateForm(
        form.updateIn(['hiddenFields', 'evaluationGroupByCount'], f =>
          f.setValue({ ...evaluationCount, [evaluationType]: totalHits }).setTouched(true)
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalHits, evaluationType]);

  // In the case of the application list, we need to manually handle the loadmore functionality, because the application API supports other pagination.
  items = useMemo(() => {
    if (evaluationType !== PER_AP) {
      return items;
    }
    const item = (prevItems ?? []).concat(items ?? []);
    setPrevItems(item);
    return item;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Reset previous items when evaluation type or search term changes
  useEffect(() => {
    setPrevItems([]);
    // set the items array to [] when groupby evaluation is changed or search term changes
  }, [evaluationType, searchTerm]);

  totalHits = useMemo(() => {
    if (evaluationType !== PER_AP) {
      return totalHits;
    }
    if (totalHits === undefined) {
      return prevTotalHits;
    }
    setPrevTotalHits(totalHits);
    return totalHits;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationType, totalHits]);

  canLoadMore = useMemo(() => {
    if (evaluationType !== PER_AP) {
      return canLoadMore;
    }
    if (totalHits === 0) return false;
    return Math.ceil(totalHits / pagination.pageSize) !== pagination.page;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div className={locals.groupTableWrapper}>
      <div className={locals.wrapper}>
        <ContainedList
          label={
            <Stack gap="disabled">
              <AlertTypography variant="body-bold" color="color900" content={getContent(totalHits, evaluationType)} />
              <AlertTypography
                variant="body-small"
                color="color700"
                content={t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupbyDescription')}
              />
            </Stack>
          }
          className={locals.tableContainer}
          kind="on-page"
          action={
            <ExpandableSearch
              placeholder={t('in-alerting:components.searchByName')}
              labelText={t('in-alerting:components.search')}
              value={inputValue}
              onChange={handleSearchChange}
              closeButtonLabelText={t('in-alerting:components.clearSearch')}
              size="lg"
            />
          }
        >
          {items && items.length > 0 ? (
            items.map((item, index) => {
              const label = getLabel(item);
              const key = `${label}-${index}`;
              return (
                <ContainedListItem key={key}>
                  <div className={locals.list}>
                    <div className={locals.label}>
                      <ColumnizedContent columnDefinitions={labelColumnDefinitions} item={item} />
                    </div>
                    {evaluationType !== PER_AP ? (
                      <div className={locals.metrics}>
                        <ColumnizedContent
                          columnDefinitions={metricColumnDefinitions}
                          item={item}
                          progress={progress}
                          timeConfig={timeConfig}
                          sparkChartGranularity={granularity}
                        />
                      </div>
                    ) : (
                      <ColumnizedContent
                        columnDefinitions={APMetricColumnDefinitions}
                        item={item}
                        progress={progress}
                        timeConfig={timeConfig}
                        sparkChartGranularity={granularity}
                      />
                    )}
                  </div>
                </ContainedListItem>
              );
            })
          ) : !progress?.loading ? (
            <ContainedListItem>
              <Stack align="center">{t('in-alerting:components.noItemsAvailable')}</Stack>
            </ContainedListItem>
          ) : (
            <></>
          )}
          {canLoadMore && !progress.loading && (
            <ContainedListItem>
              <Stack align="center">
                <Button
                  kind="action"
                  onClick={() => {
                    return evaluationType === PER_AP ? loadMoreData(pagination, setPagination, progress) : loadMore();
                  }}
                  size="compact"
                >
                  {t('in-alerting:components.loadMore')}
                </Button>
              </Stack>
            </ContainedListItem>
          )}

          {progress?.loading && <LiHorizontalIndicator progress={progress} />}
        </ContainedList>
      </div>
    </div>
  );
}

function getContent(totalHits, evaluationType) {
  if (evaluationType === PER_AP) {
    return t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupByApplication', {
      count: totalHits
    });
  } else if (evaluationType === PER_AP_SERVICE) {
    return t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupByServices', {
      count: totalHits
    });
  }
  return t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupByEndpoint', {
    count: totalHits
  });
}

function getLabel(item) {
  return item.name;
}

function labelColumns({ itemlabelColumnId, getColor, showChartGroupMarkers, groupIcon, groupbyTag }) {
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
      getContent({ item }) {
        return <GroupByKeyValue id={item?.application?.label ?? item.name} groupbyTag={groupbyTag} />;
      }
    }
  ];
}

function applicationMetricColumns({ columnDefinitions, fields, timeConfig }) {
  return [
    ...(columnDefinitions || emptyArray),
    ...fields.map(() => {
      return {
        shrink: false,
        width: '16rem',
        minWidth: '9rem',
        getContent({ item, sparkChartGranularity }) {
          return (
            <div className={locals.sparkChartWrapper}>
              <SparkChart
                loading={false}
                rollup={sparkChartGranularity}
                timeConfig={timeConfig}
                aggregation="MEAN"
                metrics={item?.metrics?.latency}
                metric={item?.metrics?.latencyAgg}
                tooltipFormatter={meanLatencyFixed.compact}
                label={t('in-applications:labelLatency')}
                valueTheme="blue"
              />
            </div>
          );
        }
      };
    })
  ];
}

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
          formatter = getFormattedNumber(metricDefinition, customLatencyUiFormatterName, field);
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

function getMetricDefinitionByEvaluationType(evaluationType) {
  const metricDefinition = {
    customLatencyUiFormatterName: 'LATENCY_WITH_DECIMALS',
    itemlabelColumnId: 'name',
    groupbyTagEntity: 'DESTINATION',
    orderBy: 'latency_MEAN'
  };
  if (evaluationType === PER_AP) {
    return {
      ...metricDefinition,
      groupIcon: 'lib_application',
      groupbyTag: 'application.id'
    };
  } else if (evaluationType === PER_AP_SERVICE) {
    return {
      ...metricDefinition,
      groupIcon: 'lib_application_service',
      groupbyTag: 'service.id'
    };
  } else if (evaluationType === PER_AP_ENDPOINT) {
    return {
      ...metricDefinition,
      groupIcon: 'lib_application_endpoint',
      groupbyTag: 'endpoint.id'
    };
  }
}

function getFormattedNumber(metricDefinition, customLatencyUiFormatterName, field) {
  if (isNumberFormatter(metricDefinition?.formatter)) {
    return withSiPrefixOneDecimalPlace;
  }

  if (field.metricId === 'latency' && customLatencyUiFormatterName) {
    return getBackendFormatter(customLatencyUiFormatterName);
  }

  return getBackendFormatter(metricDefinition?.formatter);
}

function loadMoreData(pagination, setPagination, progress) {
  if (progress?.loading) {
    return;
    // Don't set the page number in case the groupby is loading.
  }
  setPagination({ page: pagination.page + 1, pageSize: pagination.pageSize });
}
