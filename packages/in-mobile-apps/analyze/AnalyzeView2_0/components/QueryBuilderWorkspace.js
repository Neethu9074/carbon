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
} from 'in-mobile-apps/tracker';
import {
  toBackendQueryModel,
  getMaximumExpressionDepth
} from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import * as groupingConfiguratorsByDataSource from 'in-mobile-apps/groupingConfigurators';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import { metricRenderers } from 'in-mobile-apps/analyze/AnalyzeView2_0/metrics';
import * as queryBuildersByDataSource from 'in-mobile-apps/queryBuilder';
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
import { t } from 'in-i18n';

export default function MobileAppsQueryBuilderWorkspace(props) {
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
              unifiedMetricsSource="MOBILE_APP"
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
              {t('in-mobile-apps:queryInvalid')}
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
