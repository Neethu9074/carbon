/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

import SessionsChart from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/SessionsChart';
import TopPagesList from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/TopPagesList';
import UsersChart from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/UsersChart';
import { websitesBusinessConversionGoalsEnabled } from 'in-services/featureFlags';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

interface BusinessImpactProps {
  websiteId: string;
  timeConfig: TimeConfig;
  tagFilters: any;
}

export default function BusinessImpact({ websiteId, timeConfig }: BusinessImpactProps) {
  return (
    <>
      {websitesBusinessConversionGoalsEnabled && (
        <Row>
          <Col md>
            {/* TODO:  These cards will be replaced with their proper components once they are implemented. */}
            <Card title={t('in-websites:websiteDashboard.tabs.businessImpact.conversionGoals')}>
              <></>
            </Card>
          </Col>
          <Col md>
            <Card title={t('in-websites:websiteDashboard.tabs.businessImpact.funnels')}>
              <></>
            </Card>
          </Col>
          <Col md>
            <Card title={t('in-websites:websiteDashboard.tabs.businessImpact.activeSessions')}>
              <></>
            </Card>
          </Col>
        </Row>
      )}
      <Row>
        <Col lg>
          <SessionsChart websiteId={websiteId} timeConfig={timeConfig} />
        </Col>
        <Col lg>
          <UsersChart websiteId={websiteId} timeConfig={timeConfig} />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <TopPagesList timeConfig={timeConfig} />
        </Col>
        <Col lg>
          <></>
        </Col>
      </Row>
    </>
  );
}
