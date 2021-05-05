/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import QueryBuilderSection, {
  DEFAULT_MAX_EXPRESSION_DEPTH
} from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/LogsDistributionChartSection';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import { filterAdded, queryChanged, groupAdded, chartChanged } from 'in-logging/analyze/AnalyzeView/tracker';
import LogsGroupingConfigurator from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import { error } from 'in-new-components/Message/types';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LoggingQueryBuilderWorkspace(props) {
  const {
    onFormModelChange,
    formModel,
    backendQueryModel,
    onGroupByChange,
    onChartedMetricsChange,
    isGrouped,
    isValid,
    validationError,
    children,
    isLoading,
    groupBy,
    chartedMetrics
  } = props;

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} />}>
      <LeftRightPadding>
        <Stack space="gutter">
          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={LogsQueryBuilder}
              hasError={!isValid}
              useLastValidStateWhenErroneous
              maxExpressionDepth={DEFAULT_MAX_EXPRESSION_DEPTH}
              getSuggestionLabel={({ item }) => item}
              tracking={{
                onTagAdded: filterAdded,
                onQueryChanged: () => queryChanged(backendQueryModel)
              }}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={LogsGroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
              tracking={{
                onGroupAdded: group => groupAdded({ group: group.groupbyTag })
              }}
            />

            {isValid && (
              <LogsDistributionChartSection
                chartedMetrics={chartedMetrics}
                onChartedMetricsChange={onChartedMetricsChange}
                backendQueryModel={backendQueryModel}
                tracking={{
                  onChartChanged: chartConfig => chartConfig && chartChanged(chartConfig)
                }}
              />
            )}

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
          </Sections>
          {!isValid && !isLoading && (
            <Message type={error} withIcon small>
              {validationError ??
                t('in-logging:theQueryConfigurationIsInvalidPleaseAddressTheValidationFailuresBeforeContinuing')}
            </Message>
          )}
          {children}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
