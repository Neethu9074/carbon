/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { FacetedSearchPresenter } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-mobile-apps/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/ChartsPresenter';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import MobileBeacons from 'in-mobile-apps/analyze/AnalyzeView2_0/components/MobileBeacons';
import GroupedView from 'in-components/AnalyzeView/GroupedView';

export default function GroupedMobileBeacons(props) {
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        Sidebar={FacetedSearchPresenter}
        Chart={ChartsPresenter}
        getLabel={getLabel}
        itemlabelColumnId="name"
        getData={getTableData}
        UngroupedView={MobileBeacons}
        withSamplingTooltip
      />
    </QueryBuilderWorkspace>
  );
}

function getLabel(item) {
  return String(JSON.parse(item.name));
}

function getTableData({ timeConfig, backendQueryModel, groupBy, cursor, orderByGroups, metrics, dataSource }) {
  return getMobileAppBeaconGroups({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    timeConfig,
    tagFilterExpression: addDataSourceToBackendQueryModel({ backendQueryModel, dataSource }),
    group: groupBy,
    order: orderByGroups,
    metrics
  });
}
