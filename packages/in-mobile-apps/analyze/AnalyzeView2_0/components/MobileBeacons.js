/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Link, Stack } from '@instana/components';

import {
  getLabel as getDroppedBeaconLabel,
  getDurationTime
} from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/DroppedBeacon';
import { getLabel } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import { FacetedSearchPresenter } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import UngroupedViewTable, { retrievalSize } from 'in-components/AnalyzeView/UngroupedView/UngroupedViewTable';
import QueryBuilderWorkspace from 'in-mobile-apps/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import { ChartsPresenter } from 'in-mobile-apps/analyze/AnalyzeView2_0/components/ChartsPresenter';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import getMobileAppEnuSessions from 'in-mobile-apps/subscriptions/getMobileAppEnuSessions';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { toTagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import EnuModal from 'in-mobile-apps/analyze/AnalyzeView2_0/components/EnuModal';
import SessionView from 'in-mobile-apps/analyze/SessionView/SessionView';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { number } from 'in-services/formatters/number';
import HealthDot from 'in-components/health/HealthDot';
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
  ],
  dropBeacon: [
    erroneousColumnDefinition,
    {
      id: 'dropBeacon',
      label: t('in-mobile-apps:mobileBeacons.beaconName'),
      sortable: false,
      getContent({ beacon }, { getHrefToDetailId, groupLabel }) {
        const linkLabel = getDroppedBeaconLabel(beacon);
        return (
          <div className={locals.batchedLine}>
            <LinkToDetailPage
              beacon={beacon}
              getHrefToDetailId={getHrefToDetailId}
              linkLabel={linkLabel}
              groupLabel={groupLabel}
              noEllipsis
            />
            <BatchingIndicator
              batchCount={beacon.batchSize}
              tooltipContent={t(
                'in-mobile-apps:analyzeView.perBeaconTypeConfigs.customBatchingIndicatorTooltipContent',
                { size: beacon.batchSize }
              )}
              tooltipAlign="rightMiddle"
              noTopPosition
            />
          </div>
        );
      }
    },
    mobileAppColumnDefinition,
    {
      id: 'beaconCount',
      label: t('in-mobile-apps:mobileBeacons.beaconCount'),
      sortable: false,
      getContent({ beacon }) {
        return <div className={locals.batchedLine}>{number.compact(beacon.rateLimitCount)}</div>;
      },
      widthInAbsoluteUnit: true,
      width: '10rem'
    },
    {
      id: 'duration',
      label: t('in-mobile-apps:mobileBeacons.duration'),
      sortable: false,
      getContent({ beacon }) {
        return <div className={locals.batchedLine}>{getDurationTime(beacon)}</div>;
      },
      widthInAbsoluteUnit: true,
      width: '10rem'
    }
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

// Function to fetch session IDs of sessions that have contributed to an ENU
const getBeaconGroupInfo = (tagFilterExpression, setSessionResponses, startWindow) => {
  const responses = [];

  getMobileAppEnuSessions({
    timeConfig: {
      to: startWindow,
      focusedMoment: startWindow,
      windowSize: 86400000,
      autoRefresh: false
    },
    pagination: {
      retrievalSize: 10
    },
    tagFilterExpression: tagFilterExpression,
    group: {
      groupbyTag: 'mobileBeacon.sessionId',
      tagType: 'STRING'
    }
  }).subscribe(r => {
    for (let i = 0; i <= 10 && i < r?.data?.items?.length; i++) {
      if (r?.data?.items[i]?.name) {
        responses.push(r.data.items[i].name);
      }
    }
    setSessionResponses(responses);
  });
};

function LinkToDetailPage({ beacon, getHrefToDetailId, linkLabel, groupLabel, noEllipsis }) {
  const [sessionResponses, setSessionResponses] = useState([]);
  const startWindow = beacon.timestamp;
  useEffect(() => {
    if (!beacon.sessionId) {
      const tagFilterExpression = toTagFilter({
        name: 'mobileBeacon.userSessionId',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE',
        type: 'TAG_FILTER',
        value: beacon.userSessionId
      });

      getBeaconGroupInfo(tagFilterExpression, setSessionResponses, startWindow);
    }
  }, [beacon.sessionId, beacon.userSessionId, startWindow]);

  const handleClick = e => {
    if (!beacon.sessionId) {
      e.stopPropagation();
      // Only open dialog if there are 5 or less sessions
      if (sessionResponses.length <= 5) {
        addActiveDialog(
          <EnuModal
            sessionResponses={sessionResponses}
            mobileAppName={beacon.mobileAppLabel}
            mobileAppId={beacon.mobileAppId}
            usedMb={beacon.usedMb}
            beaconTimeStamp={beacon.timestamp}
            getHrefToDetailId={getHrefToDetailId}
            groupLabel={groupLabel}
          />
        );
      }
    }
  };

  return (
    <>
      <Link
        className={noEllipsis ? locals.noEllipsis : locals.link}
        href={
          beacon.sessionId
            ? getHrefToDetailId(
                {
                  sessionId: beacon.sessionId,
                  beaconId: beacon.beaconId,
                  beaconTimestamp: beacon.timestamp
                },
                groupLabel
              )
            : null
        }
        onClick={handleClick}
      >
        {beacon.sessionId ? (
          linkLabel
        ) : (
          <span className={locals.message} onClick={handleClick}>
            {linkLabel}
          </span>
        )}
      </Link>
    </>
  );
}
