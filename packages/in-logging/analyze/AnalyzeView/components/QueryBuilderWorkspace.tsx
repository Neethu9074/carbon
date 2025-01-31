/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message, Stack } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { TagFilter } from '@instana/types';

import {
  getMaximumExpressionDepth,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';
import LogsGroupingConfigurator from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import { StateManagementChildProps } from 'in-components/AnalyzeView/StateManagement';
import { QueryBuilderTrackingFunctions } from 'in-components/QueryBuilder';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { logSmartAlertsEnabled } from 'in-services/featureFlags';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-components/workspace/Sections';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from './QueryBuilder.mless';

interface LoggingQueryBuilderWorkspaceProps extends StateManagementChildProps {
  children: React.ReactNode;
  validationError?: string;
  disableHeader?: boolean;
}
type FilterAddedTrackingPayload = { dataSource: string; tagName: string; tagFilter?: TagFilter };
export default function LoggingQueryBuilderWorkspace(props: LoggingQueryBuilderWorkspaceProps) {
  const {
    formModel,
    onFormModelChange,
    backendQueryModel,
    onGroupByChange,
    isGrouped,
    isValid,
    validationError,
    children,
    dataSource,
    isLoading,
    groupBy,
    disableHeader
  } = props;
  const { trackUa2QueryBuilderFilterAdded, trackUa2NestingDepth, trackUa2GroupChanged } = useAnalyzeTracker();
  const tracking: QueryBuilderTrackingFunctions = {
    onTagAdded: tagFilter => {
      const tagName = (tagFilter as TagFilter).name;
      const trackingPayload: FilterAddedTrackingPayload = { dataSource, tagName };
      if (!tagName) {
        trackingPayload.tagFilter = tagFilter as TagFilter;
      }
      trackUa2QueryBuilderFilterAdded(trackingPayload);
    },
    onQueryChanged: _formModel =>
      trackUa2NestingDepth({
        dataSource,
        nestingDepth: getMaximumExpressionDepth(toBackendQueryModel(_formModel))
      })
  };

  const Content = (
    <>
      <LeftRightPadding>
        <Stack gap="gutter">
          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={LogsQueryBuilder}
              hasError={!isValid && !isLoading}
              useLastValidStateWhenErroneous
              getSuggestionLabel={({ item }) => item}
              tracking={tracking}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={LogsGroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
              tracking={{
                onGroupAdded: group =>
                  trackUa2GroupChanged({
                    dataSource,
                    tagName: group.groupbyTag
                  })
              }}
            />
          </Sections>
          {!isValid && !isLoading && (
            <Message className={locals.message} inline type="error" withIcon small>
              {validationError ??
                t('in-logging:theQueryConfigurationIsInvalidPleaseAddressTheValidationFailuresBeforeContinuing')}
            </Message>
          )}
          {children}
        </Stack>
      </LeftRightPadding>
      <Footer />
    </>
  );

  return !disableHeader ? (
    <Sticky
      header={
        <>
          <AnalyzeHeader
            isGrouped={isGrouped}
            liveModeDisabled
            liveModeDisabledTooltip={t('in-logging:liveModeDisabled')}
            withoutShadow={logSmartAlertsEnabled}
          />
        </>
      }
      backgroundColor={themes.default.ids.color.option.white}
    >
      {Content}
    </Sticky>
  ) : (
    Content
  );
}
