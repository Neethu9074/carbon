/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import QueryBuilderWorkspace from 'in-websites/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import { addTagFilters } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import getWebsiteBeaconGroups from 'in-websites/subscriptions/getWebsiteBeaconGroups';
import Beacons from 'in-websites/analyze/AnalyzeView2_0/components/Beacons';
import GroupedView from 'in-new-components/AnalyzeView/GroupedView';

export default function GroupedBeacons(props) {
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        // TODO: Item name based on configured data source
        itemName="TODOOOOO"
        getItemLabel={item => JSON.parse(item.name)}
        itemlabelColumnId="name"
        getData={({ timeConfig, backendQueryModel, orderBy, groupBy, cursor, metrics }) =>
          getTableData({
            timeConfig,
            backendQueryModel,
            groupBy,
            cursor,
            orderBy,
            metrics,
            dataSource: props.dataSource
          })
        }
        getLabel={item => JSON.parse(item.name)}
        UngroupedView={Beacons}
      />
    </QueryBuilderWorkspace>
  );
}

function getTableData({ timeConfig, backendQueryModel, groupBy, cursor, orderBy, metrics, dataSource }) {
  return getWebsiteBeaconGroups({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    timeConfig,
    tagFilterExpression: addTagFilters(backendQueryModel, [
      {
        type: 'TAG_FILTER',
        name: 'beacon.type',
        operator: 'EQUALS',
        value: dataSource
      }
    ]),
    group: groupBy,
    order: orderBy,
    metrics
  });
}
