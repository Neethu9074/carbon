/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { Fragment, FC } from 'react';

import { Link, Spacer } from '@instana/components';

// @ts-expect-error Could not find a declaration file for module
import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
// @ts-expect-error Could not find a declaration file for module
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import { getAppStatusLabel } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import { LeftHeaderProps } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/types';
import { CodeSnippet } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/CodeSnippet';
// @ts-expect-error
import { HTTP_REQUEST, VIEW_CHANGE, CUSTOM } from 'in-mobile-apps/tags';
import { millisToTwoDecimalSeconds, number } from 'in-services/formatters/number';
import { Dl } from 'in-components/HorizontalDescriptionList';
import { MobileAppMonitoringBeacon } from 'in-types';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

const dropBeaconURL = 'https://ibm.biz/dropped-beacons';

export const getLabel = (beacon: MobileAppMonitoringBeacon) => {
  const { rateLimitBeaconType, httpCallUrl, dropView, customEventName } = beacon;
  let label = '';

  switch (rateLimitBeaconType) {
    case HTTP_REQUEST:
      if (httpCallUrl) {
        const text = t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.httpRequestText');
        label = `${text} - ${httpCallUrl}`;
      }
      break;

    case VIEW_CHANGE:
      if (dropView) {
        const text = t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.viewTransitionText');
        label = `${text} - ${dropView}`;
      }
      break;

    case CUSTOM:
      if (customEventName) {
        const text = t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.customEventText');
        label = `${text} - ${customEventName}`;
      }
      break;

    default:
      break;
  }

  return label;
};

export const getExtraTooltipFields = () => ({});

export const getDurationTime = (beacon: MobileAppMonitoringBeacon) => {
  const { rateLimitTimeMax, rateLimitTimeMin } = beacon;
  const duration = rateLimitTimeMax - rateLimitTimeMin;
  return millisToTwoDecimalSeconds(duration);
};

export const LeftHeader: FC<LeftHeaderProps> = ({ beacon, earliestTimestamp }) => {
  const { rateLimitTimeMax, rateLimitTimeMin, batchSize, rateLimitCount } = beacon;
  const startTime = rateLimitTimeMin - earliestTimestamp;
  return (
    <Fragment>
      <KeyValueHeader
        label={
          <Fragment>
            {t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.droppedBeaconsLabel')}
            <BatchIndicator batchCount={batchSize} />
          </Fragment>
        }
        value={getLabel(beacon)}
        tooltipContent={getLabel(beacon)}
      />
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.startTimeLabel')}
        value={millisToTwoDecimalSeconds(startTime)}
      />
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.durationLabel')}
        value={rateLimitTimeMax > 0 ? getDurationTime(beacon) : 0}
      />
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.beaconCountLabel')}
        value={number.compact(rateLimitCount)}
      />
      {getAppStatusLabel(beacon) && (
        <KeyValueHeader
          label={t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.appStatusLabel')}
          value={getAppStatusLabel(beacon)}
        />
      )}
    </Fragment>
  );
};

export const Body: FC<{ beacon: MobileAppMonitoringBeacon }> = ({ beacon }) => {
  const { rateLimitBeaconType, rateLimitCount, internalMeta } = beacon;
  const messageMap: Record<'httpRequest' | 'viewChange' | 'custom', string> = {
    httpRequest: t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.httpMessage'),
    viewChange: t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.viewMessage'),
    custom: t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.customeEventMessage')
  };
  const messageKey = messageMap[rateLimitBeaconType as keyof typeof messageMap];
  const compactedRateLimitCount = number.compact(rateLimitCount);
  return (
    <Fragment>
      <Row>
        <Col lg={6}>
          <Dl>
            {messageKey && compactedRateLimitCount && <div>{`${compactedRateLimitCount} ${messageKey}`}</div>}

            <Spacer vertical="normal" />

            <Link href={dropBeaconURL} ellipsis external>
              {t('in-mobile-apps:sessionView.tabsSumDroppedBeacons.learnMoreAboutDroppedBeacons')}
            </Link>
          </Dl>
        </Col>

        {internalMeta && Object.keys(internalMeta).length > 0 && (
          <Col lg={6}>
            <CodeSnippet code={internalMeta} showLineNumbers={false} lang="json" />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
