/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Stack } from '@instana/components';

import {
  ua2ApiQueryPressedTracker,
  ua2ChartChangedTracker,
  ua2GroupChangedTracker,
  ua2NestingDepthTracker,
  ua2QueryBuilderFilterAddedTracker
} from 'in-websites/tracker';
import {
  getMaximumExpressionDepth,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import * as groupingConfiguratorsByDataSource from 'in-websites/groupingConfigurators';
import { ActionSection } from 'in-components/workspace/ActionSection/ActionSection';
import { metricRenderers } from 'in-websites/analyze/AnalyzeView2_0/metrics';
import * as queryBuildersByDataSource from 'in-websites/queryBuilder';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Charting from 'in-components/AnalyzeView/Charting';
import Sections from 'in-components/workspace/Sections';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';

export default function WebsiteQueryBuilderWorkspace(props) {
  const {
    formModel,
    onFormModelChange,
    backendQueryModel,
    backendQueryModelWithFacets,
    isGrouped,
    isValid,
    isLoading,
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
        <Stack gap="gutter">
          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={queryBuildersByDataSource[dataSource].QueryBuilder}
              useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
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
                  backendQueryModel={backendQueryModelWithFacets}
                  tracking={{
                    onClick: () => ua2ApiQueryPressedTracker({ dataSource })
                  }}
                />
              }
            />
          </Sections>
          {!isValid && !isLoading && (
            <Message type="error" withIcon small>
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
