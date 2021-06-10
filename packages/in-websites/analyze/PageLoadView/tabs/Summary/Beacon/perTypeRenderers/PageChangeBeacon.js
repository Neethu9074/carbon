/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import BatchIndicator from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export const getLabel = beacon => beacon.locationUrl;

export const getExtraTooltipFields = () => ({});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-websites:analyze.analyzeView.pageLoadView.pageChangeBeaconHeaderPageTransition')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.pageChangeBeaconLabelStartTime')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>
            {t('in-websites:analyze.analyzeView.pageLoadView.pageChangeBeaconHeaderPageTransition')}
          </BodyHeader>

          <Dl>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.pageChangeBeaconTitleWindowLocation')}>
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.pageChangeBeaconHeaderMeta')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
