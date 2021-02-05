/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import { isScriptError, learnMoreLabel, learnMoreHref, explanation } from 'in-websites/definitions/scriptError';
import BatchIndicator from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import LearnMore from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/LearnMore';
import RawStack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/RawStack';
import Stack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Stack';
import Meta from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/Meta';
import { millisToTwoDecimalSeconds } from 'in-services/formatters/number';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-new-components/layout/Grid';
import { isNotBlank } from 'in-services/util/string';

export const getLabel = beacon => beacon.errorMessage;

export const getExtraTooltipFields = () => ({});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('errorBeaconHeaderJSError')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-websites:analyze.analyzeView.pageLoadView.errorBeaconLabelStartTime')}
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
          <BodyHeader>{t('errorBeaconHeaderErrorDetails')}</BodyHeader>

          {!isScriptError(beacon.errorMessage) && (
            <Dl>
              <Di title="Window Location">
                <a href={beacon.locationUrl} rel="noopener noreferrer" target="_blank">
                  {beacon.locationUrl}
                </a>
              </Di>
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.errorBeaconTitleErrorMessage')}>
                {beacon.errorMessage}
              </Di>
              <Di title={t('in-websites:analyze.analyzeView.pageLoadView.errorBeaconTitleErrorType')}>
                {beacon.errorType}
              </Di>
            </Dl>
          )}

          {isScriptError(beacon.errorMessage) && (
            <LearnMore explanation={explanation} href={learnMoreHref} buttonLabel={learnMoreLabel} />
          )}
        </Col>

        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('errorBeaconHeaderMeta')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>

      <Row>
        {!isScriptError(beacon.errorMessage) && isNotBlank(beacon.stackTrace) && (
          <Col lg={12}>
            <Stack beacon={beacon} />
          </Col>
        )}
      </Row>
      <Row>
        {isNotBlank(beacon.componentStack) && (
          <Col lg={12}>
            <BodyHeader>{t('errorBeaconHeaderComponentStack')}</BodyHeader>
            <RawStack stack={beacon.componentStack} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
