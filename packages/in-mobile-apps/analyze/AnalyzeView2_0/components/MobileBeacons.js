/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import QueryBuilderWorkspace from 'in-mobile-apps/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import UngroupedViewTable, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedViewTable';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import SessionView from 'in-mobile-apps/analyze/SessionView/SessionView';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './MobileBeacons.mless';

const mobileAppColumnDefinition = {
  id: 'mobileApp',
  label: t('in-mobile-apps:mobileBeacons.mobileApp'),
  getContent({ beacon }) {
    return (
      <Link className={locals.link} href$={getLinkToMobileApp(beacon.mobileAppId)}>
        {beacon.mobileAppLabel}
      </Link>
    );
  }
};

const columnsPerDataSource = {
  sessionStart: [
    {
      id: 'sessionId',
      label: t('in-mobile-apps:mobileBeacons.sessionId'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={beacon.sessionId}
            groupLabel={groupLabel}
          />
        );
      }
    },
    mobileAppColumnDefinition
  ],
  viewChange: [
    {
      id: 'viewName',
      label: t('in-mobile-apps:mobileBeacons.viewName'),
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <LinkToDetailPage
            beacon={beacon}
            getHrefToDetailId={getHrefToDetailId}
            linkLabel={beacon.view}
            groupLabel={groupLabel}
          />
        );
      }
    },
    mobileAppColumnDefinition
  ],
  httpRequest: [
    {
      id: 'access',
      label: t('in-mobile-apps:mobileBeacons.access'),
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
    mobileAppColumnDefinition
  ],
  custom: [
    {
      id: 'eventName',
      label: t('in-mobile-apps:mobileBeacons.eventName'),
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
    mobileAppColumnDefinition
  ]
};

export default function MobileBeacons(props) {
  let content = (
    <UngroupedViewTable
      {...props}
      itemName={`in-mobile-apps:dataSources.${props.dataSource}`}
      columnDefinitions={columnsPerDataSource[props.dataSource]}
      getData={({ timeConfig, backendQueryModel, orderBy, cursor }) =>
        getTableData({ timeConfig, backendQueryModel, orderBy, cursor, dataSource: props.dataSource })
      }
      getId={item => {
        return { sessionId: item.beacon?.sessionId, beaconTimestamp: item.beacon?.timestamp };
      }}
      DetailView={SessionView}
      getDetailData={getMobileAppBeaconsForSession}
    />
  );

  if (!props.withoutHeader && !props.detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function getTableData({ timeConfig, backendQueryModel, orderBy, cursor, dataSource }) {
  return getMobileAppBeacons({
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
          sessionId: beacon.sessionId,
          beaconTimestamp: beacon.timestamp
        },
        groupLabel
      )}
    >
      {linkLabel}
    </Link>
  );
}
