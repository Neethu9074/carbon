/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import LogsDistributionChartSection from 'in-logging/analyze/AnalyzeView/components/LogsDistributionChartSection';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import LogsGroupingConfigurator from 'in-logging/analyze/AnalyzeView/workspace/LogsGroupingConfigurator';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import LogsQueryBuilder from 'in-logging/analyze/AnalyzeView/workspace/LogsQueryBuilder';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Sections from 'in-new-components/workspace/Sections';
import { warning } from 'in-new-components/Message/types';
import { error } from 'in-new-components/Message/types';
import Stack from 'in-new-components/layout/Stack';
import Message from 'in-new-components/Message';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function LoggingQueryBuilderWorkspace({
  onFormModelChange,
  formModel,
  backendQueryModel,
  onGroupByChange,
  onChartedMetricsChange,
  isGrouped,
  isInvalid,
  children,
  groupBy,
  chartedMetrics
}) {
  return (
    <Sticky header={<AnalyzeHeader isGrouped={isGrouped} />}>
      <LeftRightPadding>
        <Stack space="gutter">
          <Message type={warning} withIcon small>
            {t('in-logging:thisIsAnAlphaVersionOfANewProductCapabilityWeAdviseYouNotToRelyOnTheDataPresented')}
          </Message>

          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={LogsQueryBuilder}
              hasError={isInvalid}
              useLastValidStateWhenErroneous
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={LogsGroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
            />

            <LogsDistributionChartSection
              chartedMetrics={chartedMetrics}
              onChartedMetricsChange={onChartedMetricsChange}
              backendQueryModel={backendQueryModel}
            />

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
          </Sections>
          {isInvalid && (
            <Message type={error} withIcon small>
              {t('in-logging:theQueryConfigurationIsInvalidPleaseAddressTheValidationFailuresBeforeContinuing')}
            </Message>
          )}
          {children}
        </Stack>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}
