/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Stack } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { t } from '@instana/i18n-react';

import {
  getMaximumExpressionDepth,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import * as groupingConfiguratorsByDataSource from 'in-websites/groupingConfigurators';
import { findInvalidTraceIdTagFilter } from 'in-analyze/AnalyzeView/validationUtils';
import { ActionSection } from 'in-components/workspace/ActionSection/ActionSection';
import * as queryBuildersByDataSource from 'in-websites/queryBuilder';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { dataSourceTypes, defaultGroupings } from 'in-websites/tags';
import { useWebsiteTracker } from '../../../tracking/segTracker';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-components/workspace/Sections';
import { emptyArray } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import config from 'in-services/config';

import locals from './QueryBuilderWorkspace.mless';

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
    orderBy,
    chartedMetrics
  } = props;

  const { hasError, errors } = validate(formModel);
  const {
    ua2ApiQueryPressedTracker,
    ua2GroupChangedTracker,
    ua2NestingDepthTracker,
    ua2QueryBuilderFilterAddedTracker
  } = useWebsiteTracker();
  const timeConfig = useTimeConfig();
  const hasNoGrouping = !groupBy || !Object.keys(groupBy).length;
  const docLink = `https://instana.github.io/openapi/#operation/getBeaconGroups`;
  const endpointUrl = `https://${config.butlerDomain}/api/website-monitoring/analyze/beacon-groups`;

  function getMetricsAsApi() {
    return chartedMetrics.map(obj => {
      const metric = {};
      metric.metric = obj.metricId;
      metric.aggregation = obj.aggregationId;
      return metric;
    });
  }

  return (
    <Sticky
      header={<AnalyzeHeader formModel={formModel} isGrouped={isGrouped} />}
      backgroundColor={themes.default.ids.color.option.white}
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
              hasError={hasError}
              errors={errors}
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

            <ActionSection
              right={
                <ApiQueryAction
                  group={hasNoGrouping ? defaultGroupings[dataSource] : groupBy}
                  metrics={getMetricsAsApi()}
                  order={orderBy}
                  docsLink={docLink}
                  endpointUrl={endpointUrl}
                  timeFrame={timeConfig}
                  type={dataSourceTypes[dataSource]}
                  backendQueryModel={backendQueryModel}
                  backendQueryModelWithFacets={backendQueryModelWithFacets}
                  tracking={{
                    onClick: () => ua2ApiQueryPressedTracker({ dataSource })
                  }}
                />
              }
            />
          </Sections>
          {!isValid && !isLoading && (
            <Message className={locals.message} inline type="error" withIcon small>
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

function validate(formModel) {
  const invalidTraceIdTagFilter = findInvalidTraceIdTagFilter(formModel, 'beacon.backend.traceId');
  const hasError = invalidTraceIdTagFilter != null;
  const errors = hasError
    ? [t('in-websites:analyze.analyzeView.invalidTraceIdTagFilter', { traceId: invalidTraceIdTagFilter.value })]
    : emptyArray;
  return { hasError, errors };
}
