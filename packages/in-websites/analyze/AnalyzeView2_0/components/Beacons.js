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
import HealthDot from 'in-new-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './Beacons.mless';

const websiteColumnDefinition = {
  id: 'website',
  label: t('in-websites:beacons.website'),
  sortable: false,
  getContent({ beacon }) {
    return (
      <Link className={locals.link} href$={getLinkToWebsite(beacon.websiteId)}>
        {beacon.websiteLabel}
      </Link>
    );
  }
};

const erroneousColumnDefinition = {
  id: 'erroneous',
  label: <div className={locals.dot} />,
  sortable: false,
  getContent(item) {
    const severity = item.beacon.errorCount;
    return (
      <Tooltip content={severity > 0 ? t('in-websites:containsErrors') : t('in-websites:noErrors')} align="rightMiddle">
        <div className={locals.erroneous}>
          <HealthDot severity={severity} iconSize={10} />
        </div>
      </Tooltip>
    );
  },
  widthInAbsoluteUnit: true,
  width: '3rem'
};

const columnsPerDataSource = {
  pageLoad: [
    erroneousColumnDefinition,
    {
      id: 'path',
      label: t('in-websites:beacons.path'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'page',
      label: t('in-websites:beacons.page'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'uri',
      label: t('in-websites:beacons.uri'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'access',
      label: t('in-websites:beacons.access'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'errorMessage',
      label: t('in-websites:beacons.errorMessage'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'eventName',
      label: t('in-websites:beacons.eventName'),
      sortable: false,
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
      getItemName={({ count }) =>
        t('in-websites:dataSource', {
          context: props.dataSource,
          count,
          formattedCount: number.compact(count)
        })
      }
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
