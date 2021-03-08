/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { clamp } from 'lodash';
import React from 'react';

import QueryBuilderWorkspace from 'in-mobile-apps/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import UngroupedViewTable, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedViewTable';
import { addDataSourceToBackendQueryModel } from 'in-mobile-apps/analyze/AnalyzeView2_0/util';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import SessionView from 'in-mobile-apps/analyze/SessionView/SessionView';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import HealthDot from 'in-new-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './MobileBeacons.mless';

const erroneousColumnDefinition = {
  id: 'erroneous',
  label: <div className={locals.dot} />,
  sortable: false,
  getContent(item) {
    const severity = item.beacon.errorCount;
    return (
      <Tooltip
        content={severity > 0 ? t('in-mobile-apps:containsErrors') : t('in-mobile-apps:noErrors')}
        align="rightMiddle"
      >
        <div className={locals.erroneous}>
          <HealthDot severity={clamp(severity, 10)} iconSize={10} />
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
    return (
      <Link className={locals.link} href$={getLinkToMobileApp(beacon.mobileAppId)}>
        {beacon.mobileAppLabel}
      </Link>
    );
  }
};

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
  ]
};

export default function MobileBeacons(props) {
  let content = (
    <UngroupedViewTable
      {...props}
      getItemName={({ count }) =>
        t('in-mobile-apps:dataSource', {
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
        return {
          sessionId: item.beacon?.sessionId,
          beaconId: item.beacon?.beaconId,
          beaconTimestamp: item.beacon?.timestamp
        };
      }}
      DetailView={SessionView}
      getDetailData={getMobileAppBeaconsForSession}
      withSamplingTooltip
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
      onClick={() => {
        if (beacon.type !== 'sessionStart') {
          triggerHighlight(getHighlighterId(beacon.beaconId));
        }
      }}
    >
      {linkLabel}
    </Link>
  );
}
