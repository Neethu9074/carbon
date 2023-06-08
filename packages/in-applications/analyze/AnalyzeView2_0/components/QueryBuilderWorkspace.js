/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Message, Stack } from '@instana/components';

import {
  ua2ApiQueryPressedTracker,
  ua2GroupChangedTracker,
  ua2NestingDepthTracker,
  ua2QueryBuilderFilterAddedTracker
} from 'in-applications/tracker';
import {
  getMaximumExpressionDepth,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import TraceGroupingConfigurator from 'in-applications/analyze/components/workspace/TraceGroupingConfigurator';
import CallGroupingConfigurator from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import ApiQueryAction from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import TraceQueryBuilder from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import CallQueryBuilder from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { findInvalidTraceIdTagFilter } from 'in-analyze/AnalyzeView/validationUtils';
import { ActionSection } from 'in-components/workspace/ActionSection/ActionSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-components/workspace/Sections';
import { emptyArray } from 'in-services/fixedObjects';
import { getPluginName } from 'in-sdk/pluginName';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import theme from 'in-themes';
import { t } from 'in-i18n';

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
    CustomAction
  } = props;

  const { hasError, errors } = validate(formModel);
  const renderLiveModeDisableTooltip = () => {
    if (dataSource === 'calls') {
      return t('in-applications:callsLiveModeDisabled');
    } else if (dataSource === 'traces') {
      return t('in-applications:tracesLiveModeDisabled');
    }
  };

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
      backgroundColor={theme.lib.colors.white}
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
              hasError={hasError}
              errors={errors}
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

            <ActionSection
              right={
                <Stack direction={'horizontal'} gap={'small'}>
                  {CustomAction && <CustomAction {...props} />}
                  <ApiQueryAction
                    backendQueryModel={backendQueryModel}
                    backendQueryModelWithFacets={backendQueryModelWithFacets}
                    tracking={{
                      onClick: () => ua2ApiQueryPressedTracker({ dataSource })
                    }}
                  />
                </Stack>
              }
            />
          </Sections>
          {!isValid && !isLoading && (
            <Message type="error" withIcon small>
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
