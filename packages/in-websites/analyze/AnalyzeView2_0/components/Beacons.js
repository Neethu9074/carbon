/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import QueryBuilderWorkspace from 'in-websites/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import UngroupedViewTable, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedViewTable';
import getWebsiteBeaconsForPageLoad from 'in-websites/subscriptions/getWebsiteBeaconsForPageLoad';
import { addDataSourceToBackendQueryModel } from 'in-websites/analyze/AnalyzeView2_0/util';
import getWebsiteBeacons from 'in-websites/subscriptions/getWebsiteBeacons';
import PageLoadView from 'in-websites/analyze/PageLoadView/PageLoadView';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import Link from 'in-components/Link';

const columnDefinitions = [
  {
    id: 'path',
    label: 'Path',
    // TODO this logic depends on the data source
    getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
      return (
        <Link
          href={getHrefToDetailId(
            {
              pageLoadId: beacon.pageLoadId,
              beaconTimestamp: beacon.timestamp
            },
            groupLabel
          )}
        >
          {beacon.locationPath.length > 5 ? beacon.locationPath : `${beacon.locationOrigin}${beacon.locationPath}`}
        </Link>
      );
    }
  },
  {
    id: 'website',
    label: 'Website',
    getContent({ beacon }) {
      return <Link href$={getLinkToWebsite(beacon.websiteId)}>{beacon.websiteLabel}</Link>;
    }
  }
];

export default function Beacons(props) {
  let content = (
    <UngroupedViewTable
      {...props}
      itemName={`in-websites:dataSources.${props.dataSource}`}
      columnDefinitions={columnDefinitions}
      getData={({ timeConfig, backendQueryModel, orderBy, cursor }) =>
        getTableData({ timeConfig, backendQueryModel, orderBy, cursor, dataSource: props.dataSource })
      }
      getId={item => {
        return { pageLoadId: item.beacon?.pageLoadId, beaconTimestamp: item.beacon?.timestamp };
      }}
      // TODO detail view
      DetailView={PageLoadView}
      getDetailData={getWebsiteBeaconsForPageLoad}
    />
  );

  if (!props.withoutHeader && !props.detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function getTableData({ timeConfig, backendQueryModel, orderBy, cursor, dataSource }) {
  return getWebsiteBeacons({
    pagination: {
      cursor,
      retrievalSize
    },
    order: orderBy,
    timeConfig,
    tagFilterExpression: addDataSourceToBackendQueryModel({backendQueryModel, dataSource}),
  });
}
