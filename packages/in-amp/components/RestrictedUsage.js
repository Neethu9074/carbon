/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import ExpiredLicenses from 'in-amp/components/ExpiredLicenses';
import QueuedLicenses from 'in-amp/components/QueuedLicenses';
import ActiveLicenses from 'in-amp/components/ActiveLicenses';
import UsageCharts from 'in-amp/components/UsageCharts';
import { Row, Col } from 'in-components/layout/Grid';
import config from 'in-services/config';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function RestrictedUsage() {
  const { windowSize, setWindowSize, tenantUnit, timeRange, setTimeRange, to, setTo, presentation, setPresentation } =
    useAmpUrlInformation({
      tenant: config.tenant,
      unit: config.tenantUnit
    });

  return (
    <>
      <Title title={t('in-amp:components.restrictedUsage.accountUsage')} />

      <AmpInformationModifier
        windowSize={windowSize}
        setWindowSize={setWindowSize}
        tenantUnit={tenantUnit}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        setTo={setTo}
        presentation={presentation}
        setPresentation={setPresentation}
      />

      <UsageCharts
        windowSize={windowSize}
        timeRange={timeRange}
        to={to}
        tenantUnit={tenantUnit}
        showAggregatedMetrics={false}
        presentation={presentation}
        showPurchasedMetric={false}
      />

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
