/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import {
  ua2QueryBuilderFilterAddedTracker,
  ua2GroupChangedTracker,
  ua2ChartChangedTracker,
  ua2ApiQueryPressedTracker,
  ua2NestingDepthTracker
} from 'in-applications/tracker';
import {
  toBackendQueryModel,
  getMaximumExpressionDepth,
  EMPTY_EXPRESSION
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import LatencyDistributionChart from 'in-applications/analyze/components/ChartingPresenter/LatencyDistributionChart';
import TraceGroupingConfigurator from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import { joinExpressions, removeTopLevelFilters } from 'in-components/QueryBuilder/transformation/formModel';
import CallGroupingConfigurator from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import TraceQueryBuilder from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import CallQueryBuilder from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { ActionSection } from 'in-components/workspace/ActionSection/ActionSection';
import { metricRenderers } from 'in-applications/analyze/AnalyzeView2_0/metrics';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';
import { emptyArray } from 'in-services/fixedObjects';
import { error } from 'in-components/Message/types';
import { getPluginName } from 'in-sdk/pluginName';
import Stack from 'in-components/layout/Stack';
import Message from 'in-components/Message';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './QueryBuilderWorkspace.mless';

const queryBuilderPerDataSource = {
  calls: CallQueryBuilder,
  traces: TraceQueryBuilder
};

const groupingConfiguratorPerDataSource = {
  calls: CallGroupingConfigurator,
  traces: TraceGroupingConfigurator
};

export default function ApplicationsQueryBuilderWorkspace(props) {
  const {
    onFormModelChange,
    formModel,
    backendQueryModel,
    isGrouped,
    isValid,
    isLoading,
    children,
    dataSource,
    groupBy,
    onGroupByChange,
    useLastValidStateWhenErroneous,
    chartedMetrics,
    chartableDataSeries,
    hiddenCalls,
    groupedViewConfiguration
  } = props;
  return (
    <Sticky
      header={<AnalyzeHeader formModel={formModel} isGrouped={isGrouped} />}
      backgroundColor={theme.lib.colors.white}
    >
      <LeftRightPadding>
        <Stack space="gutter">
          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={queryBuilderPerDataSource[dataSource]}
              useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
              tracking={{
                onTagAdded: tagFilter => ua2QueryBuilderFilterAddedTracker({ dataSource, tagName: tagFilter.name }),
                onQueryChanged: formModel =>
                  ua2NestingDepthTracker({
                    dataSource,
                    nestingDepth: getMaximumExpressionDepth(toBackendQueryModel(formModel))
                  })
              }}
              getSuggestionLabel={({ item, tagName }) =>
                tagName === 'technology' ? `${getPluginName(item)} (${item})` : item
              }
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={groupingConfiguratorPerDataSource[dataSource]}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
              tracking={{
                onGroupAdded: group => ua2GroupChangedTracker({ dataSource, tagName: group.groupbyTag })
              }}
            />

            <Charting
              {...props}
              getCustomGroupLabel={groupedViewConfiguration.getCustomGroupLabel}
              chartedMetrics={chartedMetrics.map(chartedMetric => ({
                ...chartedMetric,
                rendererId: metricRenderers[dataSource][chartedMetric.metricId] ?? 'stackedBar'
              }))}
              unifiedMetricsSource="APPLICATION"
              mapMetricConfiguration={(metricConfiguration, { dataSource }) => ({
                ...metricConfiguration,
                tagFilterExpression: metricConfiguration.tagFilterExpression,
                dataSource,
                ...hiddenCalls
              })}
              forceLoadingIndicator={isGrouped && chartableDataSeries == null}
              tracking={{
                onChartChanged: ({ metricId, aggregationId }) =>
                  ua2ChartChangedTracker({ dataSource, metric: metricId, aggregation: aggregationId })
              }}
              CustomChart={
                chartedMetrics[0].metricId === 'latency' &&
                chartedMetrics[0].aggregationId === 'DISTRIBUTION' &&
                (() => (
                  <div className={locals.latencyDistribution}>
                    <LatencyDistributionChart
                      dataSource={dataSource}
                      tagFilterExpression={backendQueryModel ?? EMPTY_EXPRESSION}
                      hiddenCalls={hiddenCalls}
                      updateFilter={({ add = emptyArray, remove = emptyArray }) =>
                        onFormModelChange(
                          joinExpressions({
                            expressions: [removeTopLevelFilters(formModel, ...remove), ...add]
                          })
                        )
                      }
                    />
                  </div>
                ))
              }
            />

            <ActionSection
              right={
                <ApiQueryAction
                  backendQueryModel={backendQueryModel}
                  tracking={{
                    onClick: () => ua2ApiQueryPressedTracker({ dataSource })
                  }}
                />
              }
            />
          </Sections>
          {!isValid && !isLoading && (
            <Message type={error} withIcon small>
              {t('in-applications:analyze.invalidQueryConfig')}
            </Message>
          )}
          {children}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
