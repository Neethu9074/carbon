/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import QueryBuilderWorkspace from 'in-websites/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import GroupedView from 'in-new-components/AnalyzeView/GroupedView';

export default function GroupedBeacons(props) {
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        getItemLabel={getItemLabel}
        getLabel={getItemLabel}
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
        UngroupedView={Beacons}
        withSamplingTooltip
      />
    </QueryBuilderWorkspace>
  );
}
function getItemLabel(item) {
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
