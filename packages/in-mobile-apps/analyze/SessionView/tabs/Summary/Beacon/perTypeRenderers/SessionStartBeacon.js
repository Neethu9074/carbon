/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import KeyValueHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/KeyValueHeader';
import BodyHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BodyHeader';
import Meta from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/Meta';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export const getLabel = beacon => beacon.view;

export const hideStartTimeTooltipField = true;

export const getExtraTooltipFields = () => ({});

export const LeftHeader = ({ beacon }) => (
  <Fragment>
    <KeyValueHeader
      label={t('in-mobile-apps:sessionView.tabsSumSessionStartBeacon.sessionStartLabel')}
      value={getLabel(beacon)}
    />
  </Fragment>
);

export const Body = ({ beacon }) => {
  return (
    <Fragment>
      <Row>
        {Object.keys(beacon.meta).length > 0 && (
          <Col lg={6}>
            <BodyHeader>{t('in-mobile-apps:sessionView.tabsSumSessionStartBeacon.metaHeader')}</BodyHeader>
            <Meta beacon={beacon} />
          </Col>
        )}
      </Row>
    </Fragment>
  );
};
