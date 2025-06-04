/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Message, Stack } from '@instana/components';
import { themes } from '@instana/design-tokens';

import {
  getMaximumExpressionDepth,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import TraceGroupingConfigurator from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import CallGroupingConfigurator from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import SubtraceQueryBuilder from 'in-applications/analyze/components/workspace/SubtraceQueryBuilder';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import TraceQueryBuilder from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import CallQueryBuilder from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { findInvalidTraceIdTagFilter } from 'in-analyze/AnalyzeView/validationUtils';
import { ActionSection } from 'in-components/workspace/ActionSection/ActionSection';
import { FilterActions } from 'in-components/SaveFilters/FilterActions';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { useWebsiteTracker } from 'in-websites/tracking/segTracker';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-components/workspace/Sections';
import { defaultGroupings } from 'in-applications/tags';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import config from 'in-services/config';
import { t } from 'in-i18n';

const queryBuilderPerDataSource = {
  calls: CallQueryBuilder,
  traces: TraceQueryBuilder,
  subtraces: SubtraceQueryBuilder
};

const groupingConfiguratorPerDataSource = {
  calls: CallGroupingConfigurator,
  traces: TraceGroupingConfigurator,
  subtraces: CallGroupingConfigurator //TODO:need to change
};

export default function ApplicationsQueryBuilderWorkspace(props) {
  const { ua2FilterRemoved } = useWebsiteTracker();
  const { trackUa2QueryBuilderFilterAdded, trackUa2NestingDepth, trackUa2GroupChanged, trackUa2ApiQueryPressed } =
    useAnalyzeTracker();
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
    orderBy,
    onGroupByChange,
    useLastValidStateWhenErroneous,
    CustomAction,
    chartedMetrics,
    hiddenCalls,
    orderByGroups
  } = props;

  const { hasError, errors } = validate(formModel);
  const renderLiveModeDisableTooltip = () => {
    if (dataSource === 'calls') {
      return t('in-applications:callsLiveModeDisabled');
    } else if (dataSource === 'traces') {
      return t('in-applications:tracesLiveModeDisabled');
    }
  };
  const timeConfig = useTimeConfig();
  const docCallOrTrace = dataSource === 'calls' ? 'getCallGroup' : 'getTraceGroups';
  const getEndpointCallOrTrace = () => {
    if (dataSource === 'traces') {
      if (groupBy && Object.keys(groupBy).length) {
        return 'trace-groups';
      } else {
        return 'traces';
      }
    } else {
      return 'call-groups';
    }
  };
  const endpointCallOrTrace = getEndpointCallOrTrace();
  const hasNoGroupingForCalls = dataSource === 'calls' && (!groupBy || !Object.keys(groupBy).length);
  const docLink = `https://instana.github.io/openapi/#operation/${docCallOrTrace}`;
  const endpointUrl = `https://${config.butlerDomain}/api/application-monitoring/analyze/${endpointCallOrTrace}`;

  function getMetricsAsApi() {
    return chartedMetrics.map(obj => {
      const metric = {};
      metric.metric = obj.metricId;
      metric.aggregation = obj.aggregationId;
      return metric;
    });
  }

  const latencyDistributionChartSelected = chartedMetrics.some(
    m => m.aggregationId === 'DISTRIBUTION' && m.metricId === 'latency'
  );
  const noChartSelected = chartedMetrics.length === 0;

  const disableApiQuery = latencyDistributionChartSelected || noChartSelected;
  let disabledApiQueryTooltip;
  if (latencyDistributionChartSelected) {
    disabledApiQueryTooltip = t('in-applications:analyze.disabledApiQueryLatencyDistributionChart');
  } else if (noChartSelected) {
    disabledApiQueryTooltip = t('in-applications:analyze.disabledApiQueryNoChart');
  }

  return (
    <Sticky
      header={
        <AnalyzeHeader
          formModel={formModel}
          isGrouped={isGrouped}
          liveModeDisabled
          liveModeDisabledTooltip={renderLiveModeDisableTooltip()}
        />
      }
      backgroundColor={themes.default.ids.color.option.white}
    >
      <LeftRightPadding>
        <Stack gap="gutter">
          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={queryBuilderPerDataSource[dataSource]}
              useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
              tracking={{
                onTagAdded: tagFilter => trackUa2QueryBuilderFilterAdded({ dataSource, tagName: tagFilter.name }),
                onQueryChanged: formModel =>
                  trackUa2NestingDepth({
                    dataSource,
                    nestingDepth: getMaximumExpressionDepth(toBackendQueryModel(formModel))
                  }),
                onTagRemoved: tagFilter => ua2FilterRemoved({ dataSource, tagName: tagFilter.name })
              }}
              getSuggestionLabel={({ item, tagName }) =>
                tagName === 'technology' ? `${getPluginName(item)} (${item})` : item
              }
              getSuggestionsProps={hiddenCalls}
              hasError={hasError}
              errors={errors}
            />

            {dataSource !== 'subtraces' && (
              <GroupingConfiguratorSection
                value={groupBy}
                onChange={onGroupByChange}
                GroupingConfigurator={groupingConfiguratorPerDataSource[dataSource]}
                tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
                tracking={{
                  onGroupAdded: group => trackUa2GroupChanged({ dataSource, tagName: group.groupbyTag })
                }}
              />
            )}
            <ActionSection
              left={
                dataSource !== 'subtraces' && (
                  <Stack direction={'horizontal'} gap={'small'}>
                    {CustomAction && <CustomAction {...props} />}
                    <ApiQueryAction
                      group={hasNoGroupingForCalls ? defaultGroupings.calls : groupBy}
                      hiddenCalls={hiddenCalls}
                      metrics={getMetricsAsApi()}
                      order={isGrouped ? removeAggregation(orderByGroups, dataSource) : orderBy}
                      backendQueryModel={backendQueryModel}
                      backendQueryModelWithFacets={backendQueryModelWithFacets}
                      tracking={{
                        onClick: () => trackUa2ApiQueryPressed({ dataSource })
                      }}
                      docsLink={docLink}
                      endpointUrl={endpointUrl}
                      timeFrame={timeConfig}
                      disabled={disableApiQuery}
                      disabledTooltip={disabledApiQueryTooltip}
                    />
                  </Stack>
                )
              }
              right={
                <FilterActions
                  backendQueryModel={backendQueryModel}
                  group={groupBy}
                  formModel={formModel}
                  setUrlState={props.setUrlState}
                  dataSource={dataSource}
                />
              }
            />
          </Sections>
          {!isValid && !isLoading && (
            <Message type="error" withIcon small fullInlineWidth>
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

function validate(formModel) {
  const invalidTraceIdTagFilter = findInvalidTraceIdTagFilter(formModel, 'trace.id');
  const hasError = invalidTraceIdTagFilter != null;
  const errors = hasError
    ? [t('in-applications:analyze.invalidTraceIdTagFilter', { traceId: invalidTraceIdTagFilter.value })]
    : emptyArray;
  return { hasError, errors };
}

const removeAggregation = (order, dataSource) => {
  if (dataSource === 'calls') {
    return {
      ...order,
      by: order.by.includes('_') ? order.by.split('_')[0] : order.by
    };
  }
  return order;
};
