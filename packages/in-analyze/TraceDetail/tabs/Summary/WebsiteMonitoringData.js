/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState, withProps } from 'recompose';
import React, { Fragment } from 'react';

import { Button } from '@instana/components';
import { Card } from '@instana/components';
import { Link } from '@instana/components';

import {
  showWebsiteDetailsInTraceView,
  hideWebsiteDetailsInTraceView,
  navigateToPageLoadFromBackendTrace
} from 'in-websites/tracker';
import { getCorrelatedWebsiteBeacons } from 'in-analyze/TraceDetail/tabs/Summary/websiteCorrelation';
import BeaconUserSummary from 'in-websites/analyze/BeaconUserSummary/BeaconUserSummary';
import { getLinkToWebsite, getLinkToPageLoad } from 'in-websites/navigation/paths';
import { tryGet, trySet } from 'in-services/localStorage';
import { Row, Col } from 'in-new-components/layout/Grid';
import connect from 'in-hoc/connectTo';
import { Trans, t } from 'in-i18n';

import locals from './WebsiteMonitoringData.mless';

const localStorageKey = 'traceView.showWebsiteMonitoringData';

export default compose(
  connect(({ correlationId, traceId, startTime }) => {
    return {
      result: getCorrelatedWebsiteBeacons({ correlationId, traceId, startTime })
    };
  }),
  withState('showDetails', 'setShowDetails', tryGet(localStorageKey) !== 'false'),
  withProps(({ setShowDetails }) => ({
    setShowDetails: show => {
      trySet(localStorageKey, show);
      if (show) {
        showWebsiteDetailsInTraceView();
      } else {
        hideWebsiteDetailsInTraceView();
      }
      setShowDetails(show);
    }
  }))
)(function WebsiteMonitoringData({ result, showDetails, setShowDetails }) {
  if (!result || result.data == null || result.data.items.length === 0) {
    return null;
  }

  const beacon = result.data.items[0].beacon;

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
            </span>
          </Card>
        </Col>
      </Row>

      {showDetails && <BeaconUserSummary beacon={beacon} withoutSideMargin />}
    </Fragment>
  );
});
