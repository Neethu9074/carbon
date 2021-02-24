/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import QueryBuilderWorkspace from 'in-mobile-apps/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppBeaconGroups from 'in-mobile-apps/subscriptions/getMobileAppBeaconGroups';
import MobileBeacons from 'in-mobile-apps/analyze/AnalyzeView2_0/components/MobileBeacons';
import GroupedView from 'in-new-components/AnalyzeView/GroupedView';

export default function GroupedMobileBeacons(props) {
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        itemName={`in-mobile-apps:dataSources.${props.dataSource}`}
        getItemLabel={getItemLabel}
        itemlabelColumnId="name"
        getData={({ timeConfig, backendQueryModel, orderByGroups, groupBy, cursor, metrics }) =>
          getTableData({
            timeConfig,
            backendQueryModel,
            groupBy,
            cursor,
            orderByGroups,
            metrics,
            dataSource: props.dataSource
          })
        }
        getLabel={getItemLabel}
        UngroupedView={MobileBeacons}
        withSamplingTooltip
      />
    </QueryBuilderWorkspace>
  );
}

function getItemLabel(item) {
  return JSON.parse(item.name);
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
