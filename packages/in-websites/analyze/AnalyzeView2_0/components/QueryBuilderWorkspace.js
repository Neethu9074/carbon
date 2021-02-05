/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import ApiQueryAction from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryAction';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import { ActionSection } from 'in-new-components/workspace/ActionSection/ActionSection';
import * as groupingConfiguratorsByDataSource from 'in-websites/groupingConfigurators';
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
    metricCatalogFilter
  } = props;
  return (
    <Sticky header={<AnalyzeHeader formModel={formModel} isGrouped={isGrouped} />}>
      <LeftRightPadding>
        <Stack space="gutter">
          <Sections>
            <QueryBuilderSection
              value={formModel}
              onChange={onFormModelChange}
              QueryBuilder={queryBuildersByDataSource[dataSource].QueryBuilder}
              useLastValidStateWhenErroneous={useLastValidStateWhenErroneous}
            />

            <GroupingConfiguratorSection
              value={groupBy}
              onChange={onGroupByChange}
              GroupingConfigurator={groupingConfiguratorsByDataSource[dataSource].GroupingConfigurator}
              tagFilterExpression={backendQueryModel || toBackendQueryModel([])}
            />

            <Charting
              {...props}
              metricCatalogFilter={metricCatalogFilter}
              unifiedMetricsSource="WEBSITE"
              mapMetricConfiguration={mapMetricConfiguration}
            />

            <ActionSection right={<ApiQueryAction backendQueryModel={backendQueryModel} />} />
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
