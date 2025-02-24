/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Card } from '@instana/components';

import ExpiredLicenses from 'in-amp/components/ExpiredLicenses';
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import ActiveLicenses from 'in-amp/components/ActiveLicenses';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function RestrictedLicense() {
  return (
    <>
      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.usages.activeLicenses')}>
            <ActiveLicenses />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.usages.expiredLicenses')}>
            <ExpiredLicenses />
          </Card>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Card title={t('in-amp:components.usages.queuedLicenses')}>
            <QueuedLicenses />
          </Card>
        </Col>
      </Row>
    </>
  );
}
