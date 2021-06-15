/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/LogsDistributionChartSection';
import { filterAdded, queryChanged, groupAdded, chartChanged } from 'in-logging/analyze/AnalyzeView/tracker';
import GroupingConfiguratorSection from 'in-components/GroupingConfigurator/GroupingConfiguratorSection';
import LogsGroupingConfigurator from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-components/workspace/Sections';
import { error } from 'in-components/Message/types';
import Message from 'in-components/Message';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function LoggingQueryBuilderWorkspace(props) {
  const {
    onFormModelChange,
    formModel,
    backendQueryModel,
    onGroupByChange,
    isGrouped,
    isValid,
    validationError,
    children,
    isLoading,
    groupBy
  } = props;

  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} />}>
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
              tracking={{
                onTagAdded: tagFilterExpression => filterAdded({ tagFilterExpression }),
                onQueryChanged: fm => queryChanged({ formModel: fm })
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
                {...props}
                tracking={{
                  onChartChanged: chartConfig => chartConfig && chartChanged(chartConfig)
                }}
              />
            )}
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
