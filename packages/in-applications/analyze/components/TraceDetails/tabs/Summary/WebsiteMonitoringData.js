/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  showWebsiteDetailsInTraceView,
  hideWebsiteDetailsInTraceView,
  navigateToPageLoadFromBackendTrace
} from 'in-websites/tracker';
import { getCorrelatedWebsiteBeacons } from 'in-applications/analyze/components/TraceDetails/tabs/Summary/websiteCorrelation';
import { getLinkToWebsite, getLinkToPageLoad, getLinkToAnalyze } from 'in-websites/navigation/paths';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { getChartGranularity } from 'in-stores/metric/metric';
import { tryGet, trySet } from 'in-services/localStorage';
import { Row, Col } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Trans, t } from 'in-i18n';

import locals from './WebsiteMonitoringData.mless';

const localStorageKey = 'traceView.showWebsiteMonitoringData';

export default function WebsiteMonitoringData({ traceId, startTime, correlationId }) {
  const [showDetails, setDetails] = useState(tryGet(localStorageKey) !== 'false');
  const result = useObservable(() => getCorrelatedWebsiteBeacons({ correlationId, traceId, startTime }), [
    correlationId,
    traceId,
    startTime
  ]);

  const setShowDetails = show => {
    trySet(localStorageKey, show);
    if (show) {
      showWebsiteDetailsInTraceView();
    } else {
      hideWebsiteDetailsInTraceView();
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
          <Card title={t('in-analyze:tabs.summary.websiteMonitoringDataTitle')} icon="lib_website">
            <span className={locals.leftSide}>
              <Trans
                i18nKey="in-analyze:tabs.summary.thisTraceIsCausedByActivityOnThewebsite"
                values={{ websiteLabel: beacon.websiteLabel }}
                components={{
                  linkToWebsite: <Link href$={getLinkToWebsite(beacon.websiteId)} className={locals.link} />
                }}
              />
            </span>
            <span>
              <Button onClick={() => setShowDetails(!showDetails)} kind="secondary" size="compact">
                {showDetails
                  ? t('in-analyze:traceDetail.tabs.summary.hideWebsiteInformation')
                  : t('in-analyze:traceDetail.tabs.summary.showWebsiteInformation')}
              </Button>
              <Button
                onClick={() => navigateToPageLoadFromBackendTrace()}
                href$={getLinkToPageLoad({
                  pageLoadId: beacon.pageLoadId,
                  beaconTimestamp: beacon.timestamp
                })}
                kind="primary"
                size="compact"
              >
                {t('in-analyze:traceDetail.tabs.summary.viewWebsiteActivity')}
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
                href$={getLinkToAnalyze({
                  groupBy: {},
                  // Intentionally using "traceId" passed from the trace detail page instead of "beacon.backendTraceId". Note that the latter
                  // can hold a different "traceId" in some cases. For example in case of cache revalidation, the backend request can be served
                  // from cache, while the request will still be forwarded to the backend.
                  // Even though linking to the new trace might be a useful feature, the "Analyze Beacons" button should filter calls only by the
                  // original "traceId".
                  formModel: [tagFilter('beacon.backend.traceId', EQUALS, traceId)],
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

      {showDetails && <BeaconUserSummary beacon={beacon} withoutSideMargin />}
    </Fragment>
  );
}
