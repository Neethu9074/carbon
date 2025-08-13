/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import SessionsChart from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/SessionsChart';
import TopPagesList from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/TopPagesList';
import UsersChart from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/UsersChart';
import { Col, Row } from 'in-components/layout/Grid/Grid';

interface SummaryProps {
  websiteId: string;
  timeConfig: TimeConfig;
  tagFilters: any;
}

export default function Summary({ websiteId, timeConfig }: SummaryProps) {
  return (
    <>
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
      </Row>
    </>
  );
}
