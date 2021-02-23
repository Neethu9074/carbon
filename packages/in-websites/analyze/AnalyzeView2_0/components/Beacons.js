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
import { t } from 'in-i18n';

import locals from './Beacons.mless';

const websiteColumnDefinition = {
  id: 'website',
  label: t('in-websites:beacons.website'),
  getContent({ beacon }) {
    return (
      <Link className={locals.link} href$={getLinkToWebsite(beacon.websiteId)}>
        {beacon.websiteLabel}
      </Link>
    );
  }
};

const columnsPerDataSource = {
  pageLoad: [
    {
      id: 'path',
      label: t('in-websites:beacons.path'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={
              beacon.locationPath.length > 5 ? beacon.locationPath : `${beacon.locationOrigin}${beacon.locationPath}`
            }
            groupLabel={groupLabel}
          />
        );
      }
    },
    websiteColumnDefinition
  ],
  pageChange: [
    {
      id: 'page',
      label: t('in-websites:beacons.page'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={beacon.page}
            groupLabel={groupLabel}
          />
        );
      }
    },
    websiteColumnDefinition
  ],
  resourceLoad: [
    {
      id: 'uri',
      label: t('in-websites:beacons.uri'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={beacon.httpCallUrl}
            groupLabel={groupLabel}
          />
        );
      }
    },
    websiteColumnDefinition
  ],
  httpRequest: [
    {
      id: 'access',
      label: t('in-websites:beacons.access'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={`${beacon.httpCallMethod} ${beacon.httpCallUrl}`}
            groupLabel={groupLabel}
          />
        );
      }
    },
    websiteColumnDefinition
  ],
  error: [
    {
      id: 'errorMessage',
      label: t('in-websites:beacons.errorMessage'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={beacon.errorMessage}
            groupLabel={groupLabel}
          />
        );
      }
    },
    websiteColumnDefinition
  ],
  custom: [
    {
      id: 'eventName',
      label: t('in-websites:beacons.eventName'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={beacon.customEventName}
            groupLabel={groupLabel}
          />
        );
      }
    },
    websiteColumnDefinition
  ]
};

export default function Beacons(props) {
  let content = (
    <UngroupedViewTable
      {...props}
      itemName={`in-websites:dataSources.${props.dataSource}`}
      columnDefinitions={columnsPerDataSource[props.dataSource]}
      getData={({ timeConfig, backendQueryModel, orderBy, cursor }) =>
        getTableData({ timeConfig, backendQueryModel, orderBy, cursor, dataSource: props.dataSource })
      }
      getId={item => {
        return { pageLoadId: item.beacon?.pageLoadId, beaconTimestamp: item.beacon?.timestamp };
      }}
      // TODO detail view
      DetailView={PageLoadView}
      getDetailData={getWebsiteBeaconsForPageLoad}
      withSamplingTooltip
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
    tagFilterExpression: addDataSourceToBackendQueryModel({ backendQueryModel, dataSource })
  });
}

function LinkToDetailPage({ beacon, getHrefToDetailId, linkLabel, groupLabel }) {
  return (
    <Link
      className={locals.link}
      href={getHrefToDetailId(
        {
          pageLoadId: beacon.pageLoadId,
          beaconTimestamp: beacon.timestamp
        },
        groupLabel
      )}
    >
      {linkLabel}
    </Link>
  );
}
