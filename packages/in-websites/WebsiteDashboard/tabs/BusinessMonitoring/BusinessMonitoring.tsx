/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import SessionsChart from 'in-websites/WebsiteDashboard/tabs/BusinessMonitoring/components/SessionsChart';
import UsersChart from 'in-websites/WebsiteDashboard/tabs/BusinessMonitoring/components/UsersChart';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { TimeConfig } from 'in-types';

interface BusinessMonitoringProps {
  websiteId: string;
  timeConfig: TimeConfig;
}

export default function BusinessMonitoring({ websiteId, timeConfig }: BusinessMonitoringProps) {
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
    </>
  );
}
