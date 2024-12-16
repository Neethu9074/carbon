/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';

import { Card, Link, SvgIcon } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { useGetLinkToMobileApp, useLinkToAnalyze, useLinkToSession } from 'in-mobile-apps/navigation/paths';
import BeaconUserSummary from 'in-mobile-apps/analyze/BeaconUserSummary/BeaconUserSummary';
import getMobileAppBeacons from 'in-mobile-apps/subscriptions/getMobileAppBeacons';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { useMobileTracker } from 'in-mobile-apps/tracking/segTracker';
import { getChartGranularity } from 'in-stores/metric/metric';
import { tryGet, trySet } from 'in-services/localStorage';
import { Row, Col } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { minutes } from 'in-services/time';
import { Trans, t } from 'in-i18n';

import locals from './MobileAppMonitoringData.mless';

const localStorageKey = 'traceView.showMobileAppMonitoringData';

export default function MobileAppMonitoringData({ traceId, startTime }) {
  const { showMobileAppDetailsInTraceView, hideMobileAppDetailsInTraceView, navigateToSessionFromBackendTrace } =
    useMobileTracker();
  const [showDetails, setDetails] = useState(tryGet(localStorageKey) !== 'false');
  const getLinkToMobileAppSession = useLinkToSession();
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();

  const result = useObservable(() => {
    return getMobileAppBeacons({
      tagFilters: [{ name: 'mobileBeacon.backend.traceId', stringValue: traceId, operator: 'EQUALS' }],
      timeConfig: {
        windowSize: minutes.toMillis(20),
        to: startTime + minutes.toMillis(10),
        focusedMoment: startTime + minutes.toMillis(10)
      },
      order: {
        by: 'mobileBeacon.timestamp',
        // Get the oldest beacon, which is most likely the one that triggered this trace. Please note that if a request
        // is served from a cache, the given beacon will be linked to the old trace (the one whose response was cached).
        direction: 'ASC'
      },
      pagination: {
        retrievalSize: 1
      }
    });
  }, [traceId, startTime]);

  const setShowDetails = show => {
    trySet(localStorageKey, show);
    if (show) {
      showMobileAppDetailsInTraceView();
    } else {
      hideMobileAppDetailsInTraceView();
    }
    setDetails(show);
  };

  const timeConfig = useTimeConfig();
  if (!result || result.data == null || result.data.items.length === 0) {
    return null;
  }
  const beacon = result.data.items[0].beacon;
  const adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(timeConfig, beacon.timestamp, getChartGranularity);
  return (
    <Fragment>
      <Row singleRowTopMargin withoutSideMargin>
        <Col lg={12}>
          <Card
            title={
              <span className={locals.title}>
                <SvgIcon type="lib_mobile_app" />
                {t('in-analyze:traceDetail.tabs.summary.correspondingMobileAppActivity')}
              </span>
            }
          >
            <span className={locals.leftSide}>
              <Trans
                i18nKey="in-analyze:tabs.summary.thisTraceIsCausedByActivityOnTheMobileApp"
                values={{ mobileAppLabel: beacon.mobileAppLabel }}
                components={{
                  linkToMobileApp: <LinkToMobileApp beacon={beacon} />
                }}
              />
            </span>
            <span>
              <Button onClick={() => setShowDetails(!showDetails)} kind="secondary" size="compact">
                {showDetails
                  ? t('in-analyze:traceDetail.tabs.summary.hideMobileAppInformation')
                  : t('in-analyze:traceDetail.tabs.summary.showMobileAppInformation')}
              </Button>
              <Button
                onClick={() => navigateToSessionFromBackendTrace()}
                href={getLinkToMobileAppSession({
                  sessionId: beacon.sessionId,
                  beaconTimestamp: beacon.timestamp
                })}
                kind="primary"
                size="compact"
              >
                {t('in-analyze:traceDetail.tabs.summary.viewMobileAppActivity')}
              </Button>
              <Button
                onClick={() => {
                  if (adjustedTimeConfig !== timeConfig) {
                    addMessage(
                      {
                        type: 'info',
                        timeout: 5000,
                        content: t('in-applications:traceDetail.tabs.summary.adjustedTimeConfigForBeacon')
                      },
                      'adjustedTimeConfig'
                    );
                  }
                }}
                href={getLinkToMobileAppAnalyze({
                  groupBy: {},
                  // Intentionally using "traceId" passed from the trace detail page instead of "mobileBeacon.backendTraceId". Note that the latter
                  // can hold a different "traceId" in some cases. For example in case of cache revalidation, the backend request can be served
                  // from cache, while the request will still be forwarded to the backend.
                  // Even though linking to the new trace might be a useful feature, the "Analyze Beacons" button should filter calls only by the
                  // original "traceId".
                  formModel: [tagFilter('mobileBeacon.backend.traceId', EQUALS, traceId)],
                  beaconType: beacon.type,
                  timeConfig: adjustedTimeConfig
                })}
                kind="secondary"
                size="compact"
              >
                {t('in-applications:traceDetail.tabs.summary.analyzeBeacons')}
              </Button>
            </span>
          </Card>
        </Col>
      </Row>

      {showDetails && <BeaconUserSummary beacon={beacon} />}
    </Fragment>
  );
}

function LinkToMobileApp(props) {
  const { beacon, ...others } = props;
  const linkToMobileAppHref = useGetLinkToMobileApp(beacon.mobileAppId);

  return <Link {...others} href={linkToMobileAppHref} className={locals.link} />;
}
