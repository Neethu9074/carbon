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
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function GroupedMobileBeacons(props) {
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        getItemName={({ count }) =>
          t('in-mobile-apps:dataSource', {
            context: props.dataSource,
            count,
            formattedCount: number.compact(count)
          })
        }
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
