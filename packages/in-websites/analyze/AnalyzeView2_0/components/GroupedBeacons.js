/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { FacetedSearchPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-websites/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import GroupedView from 'in-components/AnalyzeView/GroupedView';

export default function GroupedBeacons(props) {
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        Sidebar={FacetedSearchPresenter}
        getLabel={getLabel}
        itemlabelColumnId="name"
        getData={getTableData}
        UngroupedView={Beacons}
        withSamplingTooltip
      />
    </QueryBuilderWorkspace>
  );
}

function getLabel(item) {
  return String(JSON.parse(item.name));
}

function getTableData({ timeConfig, backendQueryModel, groupBy, cursor, orderByGroups, metrics, dataSource }) {
  return getWebsiteBeaconGroups({
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
