/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Ul, LiLoadMore, LiHorizontalIndicator, Li, ColumnizedContent, SvgIcon, Typography } from '@instana/components';
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
import GroupByKeyValue from 'in-alerting/smart-alerts/applications/tearSheet/components/Grouping/GroupByKeyValue';
import { getSingleNumberMetricId, getSparkChartTimeSeriesMetricId } from 'in-components/AnalyzeView/metrics';
import { custom as customType, metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { getDataSourceConfigurations } from 'in-applications/analyze/AnalyzeView2_0/AnalyzeView';
import { getFormatter as getBackendFormatter } from 'in-services/formatters/backendFormatter';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import { withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import getCallGroups from 'in-applications/subscriptions/getCallGroups';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { getMetricCatalog } from 'in-applications/api/metricCatalog';
import { getSparkChartGranularity } from 'in-applications/metrics';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { noResultObservable } from 'in-services/util/result';
import { getFormatter } from 'in-stores/metric/formatters';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './GroupingTable.mless';

const defaultSelectableFields = [{ type: 'metric', metricId: 'latency', aggregationId: 'MEAN' }];

const fields = [...defaultSelectableFields];

export default function GroupingTable({ tagFilterExpression, includeInternal, includeSynthetic, evaluationType }) {
  const timeConfig = { ...useTimeConfig(), to: Date.now(), focusedMoment: Date.now() };
  const sparkChartGranularity = getSparkChartGranularity(timeConfig);
  const metricDefinitionByEvaluationType = getMetricDefinitionByEvaluationType(evaluationType);

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

  const hiddenCalls = useMemo(() => {
    return { includeInternal: false, includeSynthetic: false };
  }, []);

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

  const { items, progress, canLoadMore, loadMore, totalHits } = useCursorPagination(
    ({ cursor }) =>
      getData({
        includeInternal,
        includeSynthetic,
        tagFilterExpression,
        timeConfig,
        metrics: backendMetrics,
        cursor,
        metricDefinitionByEvaluationType
      }),
    [backendMetrics, evaluationType]
  );

  return (
    <div>
      {items.length > 0 && (
        <div className={locals.vGap}>
          <Typography variant="body-bold" noMargin>
            <span className={locals.color900}>
              {t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupCount', {
                count: totalHits
              })}
            </span>
          </Typography>
          <Typography variant="body-small" noMargin>
            <div className={locals.color700}>
              {t('in-alerting:smartAlerts.applications.tearSheet.grouping.groupbyDescription')}
            </div>
          </Typography>
        </div>
      )}
      <div className={locals.wrapper}>
        <Ul className={locals.tableContainer}>
          {items.length > 0 && (
            <>
              {items.map((item, index) => {
                const label = getLabel(item);
                const key = `${label}-${index}`;
                return (
                  <Li key={key} toggleContentOnRowClick={false}>
                    <div className={locals.list}>
                      <div className={locals.label}>
                        <ColumnizedContent columnDefinitions={labelColumnDefinitions} item={item} />
                      </div>
                      <div className={locals.metrics}>
                        <ColumnizedContent
                          columnDefinitions={metricColumnDefinitions}
                          item={item}
                          f
                          progress={progress}
                          timeConfig={timeConfig}
                          sparkChartGranularity={sparkChartGranularity}
                        />
                      </div>
                    </div>
                  </Li>
                );
              })}
              {canLoadMore && (
                <LiLoadMore
                  loadMore={() => {
                    loadMore();
                  }}
                />
              )}
            </>
          )}
          {progress.loading && <LiHorizontalIndicator progress={progress} />}
        </Ul>
      </div>
    </div>
  );
}

function getData({
  tagFilterExpression,
  includeInternal,
  includeSynthetic,
  timeConfig,
  metrics,
  cursor,
  metricDefinitionByEvaluationType
}) {
  return getCallGroups({
    tagFilterExpression: toBackendQueryModel(tagFilterExpression),
    group: {
      groupbyTag: metricDefinitionByEvaluationType.groupbyTag,
      groupbyTagEntity: metricDefinitionByEvaluationType.groupbyTagEntity
    },
    order: {
      by: metricDefinitionByEvaluationType.orderBy,
      direction: 'DESC'
    },
    pagination: {
      cursor,
      retrievalSize: 5
    },
    filter: {
      timeConfig
    },
    metrics: metrics,
    includeSynthetic,
    includeInternal,
    queryPrecision: 'APPROXIMATE'
  }).map(result => {
    if (result?.data?.items?.length) {
      return {
        ...result,
        data: {
          ...result.data
        }
      };
    }
    return result;
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
        return <GroupByKeyValue id={item.name} groupbyTag={groupbyTag} />;
      }
    }
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
