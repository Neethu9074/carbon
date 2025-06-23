/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getAppStatusLabel } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import BatchIndicator from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BatchIndicator';
import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import MapKeyToTranslatedDisplayName from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/EumTagMap';
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import EumMeta from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/EumMeta';
import { millisToTwoDecimalSeconds, latencyFixed } from 'in-services/formatters/number';
import { mobileAppScreenRenderingDurationEnabled } from 'in-services/featureFlags';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export const getLabel = beacon => beacon.view;

export const getExtraTooltipFields = () => ({});

export const LeftHeader = ({ beacon, earliestTimestamp }) => (
  <Fragment>
    <KeyValueHeader
      label={
        <Fragment>
          {t('in-mobile-apps:sessionView.tabsSumViewChangeBeacon.viewTransitionLabel')}
          <BatchIndicator batchCount={beacon.batchSize} />
        </Fragment>
      }
      value={getLabel(beacon)}
    />
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumViewChangeBeacon.startTimeLabel')}
      value={millisToTwoDecimalSeconds(beacon.timestamp - earliestTimestamp)}
      tooltipContent={formatDateTime(beacon.timestamp)}
    />
    {mobileAppScreenRenderingDurationEnabled && (
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumViewChangeBeacon.renderingDurationlabel')}
        value={latencyFixed.compact(beacon.duration)}
      />
    )}
    {getAppStatusLabel(beacon) && (
      <KeyValueHeader
        label={t('in-mobile-apps:sessionView.tabsSumViewChangeBeacon.appStatusLabel')}
        value={getAppStatusLabel(beacon)}
      />
    )}
  </Fragment>
);

export const Body = ({ beacon }) => {
  return (
    Object.keys(beacon.internalMeta).length > 0 && (
      <Fragment>
        <Row>
          <Col lg={6}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumViewChangeBeacon.viewTransitionLabel')}</BodyHeader>

            <Dl>
              {Object.keys(beacon.internalMeta).map(key => (
                <Di key={key} title={MapKeyToTranslatedDisplayName(key)}>
                  {beacon.internalMeta[key]}
                </Di>
              ))}
            </Dl>
          </Col>

          <Col lg={6}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumSessionStartBeacon.metaHeader')}</BodyHeader>
            <EumMeta beacon={beacon} />
          </Col>
        </Row>
      </Fragment>
    )
  );
};
