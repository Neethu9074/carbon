/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  ua2QueryBuilderFilterAddedTracker,
  ua2GroupChangedTracker,
  ua2ChartChangedTracker,
  ua2ApiQueryPressedTracker,
  ua2NestingDepthTracker
} from 'in-websites/tracker';
import {
  toBackendQueryModel,
  getMaximumExpressionDepth
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilderSection, {
  DEFAULT_MAX_EXPRESSION_DEPTH
} from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import * as groupingConfiguratorsByDataSource from 'in-websites/groupingConfigurators';
import { metricRenderers } from 'in-websites/analyze/AnalyzeView2_0/metrics';
import * as queryBuildersByDataSource from 'in-websites/queryBuilder';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Charting from 'in-new-components/AnalyzeView/Charting';
import Sections from 'in-new-components/workspace/Sections';
import { error } from 'in-new-components/Message/types';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';

export default function WebsiteQueryBuilderWorkspace(props) {
  const {
    onFormModelChange,
    formModel,
    backendQueryModel,
    isGrouped,
    isInvalid,
    children,
    dataSource,
    groupBy,
    onGroupByChange,
    useLastValidStateWhenErroneous,
    chartedMetrics,
    chartableDataSeries
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
              QueryBuilder={queryBuildersByDataSource[dataSource].QueryBuilder}
              useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
              maxExpressionDepth={DEFAULT_MAX_EXPRESSION_DEPTH}
              tracking={{
                onTagAdded: tagFilter => ua2QueryBuilderFilterAddedTracker({ dataSource, tagName: tagFilter.name }),
                onQueryChanged: formModel =>
                  ua2NestingDepthTracker({
                    dataSource,
                    nestingDepth: getMaximumExpressionDepth(toBackendQueryModel(formModel))
                  })
              }}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={groupingConfiguratorsByDataSource[dataSource].GroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
              tracking={{
                onGroupAdded: group => ua2GroupChangedTracker({ dataSource, tagName: group.groupbyTag })
              }}
            />

            <Charting
              {...props}
              chartedMetrics={chartedMetrics.map(chartedMetric => ({
                ...chartedMetric,
                rendererId: metricRenderers[dataSource][chartedMetric.metricId] ?? 'stackedBar'
              }))}
              unifiedMetricsSource="WEBSITE"
              mapMetricConfiguration={mapMetricConfiguration}
              forceLoadingIndicator={isGrouped && chartableDataSeries == null}
              tracking={{
                onChartChanged: ({ metricId, aggregationId }) =>
                  ua2ChartChangedTracker({ dataSource, metric: metricId, aggregation: aggregationId })
              }}
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
          {isInvalid && (
            <Message type={error} withIcon small>
              The query configuration is invalid. Please address the validation failures before continuing.
            </Message>
          )}
          {children}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

function mapMetricConfiguration(metricConfiguration, { dataSource }) {
  return {
    ...metricConfiguration,
    tagFilterExpression: addDataSourceToBackendQueryModel({
      backendQueryModel: metricConfiguration.tagFilterExpression,
      dataSource
    }),
    beaconType: dataSource
  };
}
