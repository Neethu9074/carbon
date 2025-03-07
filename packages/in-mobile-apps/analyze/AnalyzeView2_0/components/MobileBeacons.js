/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { getLabel } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import { FacetedSearchPresenter } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import UngroupedViewTable, { retrievalSize } from 'in-components/AnalyzeView/UngroupedView/UngroupedViewTable';
import QueryBuilderWorkspace from 'in-mobile-apps/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import { ChartsPresenter } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/ChartsPresenter';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import SessionView from 'in-mobile-apps/analyze/SessionView/SessionView';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import HealthDot from 'in-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './MobileBeacons.mless';

const erroneousColumnDefinition = {
  id: 'erroneous',
  label: <div className={locals.dot} />,
  sortable: false,
  getContent(item) {
    const severity = item.beacon.errorCount >= 1 ? 10 : 0;
    return (
      <Tooltip
        content={severity === 0 ? t('in-mobile-apps:noErrors') : t('in-mobile-apps:containsErrors')}
        align="rightMiddle"
      >
        <div className={locals.erroneous}>
          <HealthDot severity={severity} iconSize={10} />
        </div>
      </Tooltip>
    );
  },
  widthInAbsoluteUnit: true,
  width: '3rem'
};

const mobileAppColumnDefinition = {
  id: 'mobileApp',
  label: t('in-mobile-apps:mobileBeacons.mobileApp'),
  sortable: false,
  getContent({ beacon }) {
    return <MobileAppColumnComponent beacon={beacon} />;
  }
};

function MobileAppColumnComponent({ beacon }) {
  const linkToMobileAppHref = useGetLinkToMobileApp(beacon.mobileAppId);

  return (
    <Link className={locals.link} href={linkToMobileAppHref}>
      {beacon.mobileAppLabel}
    </Link>
  );
}

const columnsPerDataSource = {
  sessionStart: [
    erroneousColumnDefinition,
    {
      id: 'sessionId',
      label: t('in-mobile-apps:mobileBeacons.sessionId'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'viewName',
      label: t('in-mobile-apps:mobileBeacons.viewName'),
      sortable: false,
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
    erroneousColumnDefinition,
    {
      id: 'access',
      label: t('in-mobile-apps:mobileBeacons.access'),
      sortable: false,
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <div className={locals.batchedLine}>
            <LinkToDetailPage
              beacon={beacon}
              getHrefToDetailId={getHrefToDetailId}
              linkLabel={`${beacon.httpCallMethod} ${beacon.httpCallUrl}`}
              groupLabel={groupLabel}
            />
            <BatchingIndicator
              batchCount={beacon.batchSize}
              tooltipContent={t(
                'in-mobile-apps:analyzeView.perBeaconTypeConfigs.httpRequestBatchingIndicatorTooltipContent',
                { size: beacon.batchSize }
              )}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </div>
        );
      }
    },
    mobileAppColumnDefinition
  ],
  custom: [
    erroneousColumnDefinition,
    {
      id: 'eventName',
      label: t('in-mobile-apps:mobileBeacons.eventName'),
      sortable: false,
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <div className={locals.batchedLine}>
            <LinkToDetailPage
              beacon={beacon}
              getHrefToDetailId={getHrefToDetailId}
              linkLabel={beacon.customEventName}
              groupLabel={groupLabel}
            />
            <BatchingIndicator
              batchCount={beacon.batchSize}
              tooltipContent={t(
                'in-mobile-apps:analyzeView.perBeaconTypeConfigs.customBatchingIndicatorTooltipContent',
                {
                  size: beacon.batchSize
                }
              )}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </div>
        );
      }
    },
    mobileAppColumnDefinition
  ],
  crash: [
    erroneousColumnDefinition,
    {
      id: 'crash',
      label: t('in-mobile-apps:mobileBeacons.crash'),
      sortable: false,
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <div className={locals.batchedLine}>
            <LinkToDetailPage
              beacon={beacon}
              getHrefToDetailId={getHrefToDetailId}
              linkLabel={beacon.errorMessage}
              groupLabel={groupLabel}
            />
            <BatchingIndicator
              batchCount={beacon.batchSize}
              tooltipContent={t(
                'in-mobile-apps:analyzeView.perBeaconTypeConfigs.customBatchingIndicatorTooltipContent',
                {
                  size: beacon.batchSize
                }
              )}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </div>
        );
      }
    },
    mobileAppColumnDefinition
  ],
  perf: [
    erroneousColumnDefinition,
    {
      id: 'perf',
      label: t('in-mobile-apps:mobileBeacons.perf'),
      sortable: false,
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        return (
          <div className={locals.batchedLine}>
            <LinkToDetailPage
              beacon={beacon}
              getHrefToDetailId={getHrefToDetailId}
              linkLabel={getLabel(beacon)}
              groupLabel={groupLabel}
            />
            <BatchingIndicator
              batchCount={beacon.batchSize}
              tooltipContent={t(
                'in-mobile-apps:analyzeView.perBeaconTypeConfigs.customBatchingIndicatorTooltipContent',
                {
                  size: beacon.batchSize
                }
              )}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </div>
        );
      }
    },
    mobileAppColumnDefinition
  ]
};

export default function MobileBeacons(props) {
  const { Chart = ChartsPresenter, Sidebar = FacetedSearchPresenter } = props;

  let content = (
    <UngroupedViewTable
      {...props}
      Sidebar={Sidebar}
      Chart={Chart}
      getItemName={({ count }) =>
        t('in-mobile-apps:dataSource', {
          context: props.dataSource,
          count,
          formattedCount: number.compact(count)
        })
      }
      columnDefinitions={columnsPerDataSource[props.dataSource]}
      getData={getTableData}
      getId={item => {
        return {
          sessionId: item.beacon?.sessionId,
          beaconId: item.beacon?.beaconId,
          beaconTimestamp: item.beacon?.timestamp
        };
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
          beaconId: beacon.beaconId,
          beaconTimestamp: beacon.timestamp
        },
        groupLabel
      )}
    >
      {linkLabel}
    </Link>
  );
}
