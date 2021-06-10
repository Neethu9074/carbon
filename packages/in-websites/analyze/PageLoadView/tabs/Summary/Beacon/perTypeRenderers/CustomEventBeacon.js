/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ReferencedPageLoads from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/ReferencedPageLoads';
import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import BatchIndicator from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import BackendDi from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendDi';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import RawStack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/RawStack';
import Stack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Stack';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { latencyFixed, millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export const getLabel = beacon => beacon.customEventName;

export const getExtraTooltipFields = beacon => ({
  Duration: latencyFixed.compact(beacon.duration)
});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconHeaderCustomEvent')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconLabelStartTime')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconLabelDuration')}
      value={latencyFixed.compact(beacon.duration)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  const hasError = isNotBlank(beacon.errorMessage);

  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <BodyHeader>
            {t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconHeaderCustomEvent')}
          </BodyHeader>

          <Dl>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconTitleWindowLocation')}>
              <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                {beacon.locationUrl}
              </a>
            </Di>
            <Di title={t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconTitleEventName')}>
              {beacon.customEventName}
            </Di>
            <BackendDi beacon={beacon} />
          </Dl>
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconHeaderMeta')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      <ReferencedPageLoads beacon={beacon} />

      {hasError && (
        <Fragment>
          <Row>
            <Col lg={6}>
              <BodyHeader>
                {t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconHeaderErrorDetails')}
              </BodyHeader>

              {!isScriptError(beacon.errorMessage) && (
                <Dl>
                  <Di title={t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconTitleErrorMessage')}>
                    {beacon.errorMessage}
                  </Di>
                  <Di title={t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconTitleErrorType')}>
                    {beacon.errorType}
                  </Di>
                </Dl>
              )}

              {isScriptError(beacon.errorMessage) && (
                <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
              )}
            </Col>
          </Row>

          <Row>
            {isNotBlank(beacon.stackTrace) && (
              <Col lg={12}>
                <Stack beacon={beacon} />
              </Col>
            )}
          </Row>

          <Row>
            {isNotBlank(beacon.componentStack) && (
              <Col lg={12}>
                <BodyHeader>
                  {t('in-websites:analyze.analyzeView.pageLoadView.customEventBeaconHeaderComponentStack')}
                </BodyHeader>
                <RawStack stack={beacon.componentStack} />
              </Col>
            )}
          </Row>
        </Fragment>
      )}
    </Fragment>
  );
};
