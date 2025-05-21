/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs migration to TS
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Summary/PagesTopList';
import SessionsChart from 'in-websites/WebsiteDashboard/tabs/BusinessMonitoring/components/SessionsChart';
import UsersChart from 'in-websites/WebsiteDashboard/tabs/BusinessMonitoring/components/UsersChart';
import { summaryTab } from 'in-websites/navigation/paths';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { TimeConfig } from 'in-types';

interface BusinessMonitoringProps {
  websiteId: string;
  timeConfig: TimeConfig;
  tagFilters: any;
}

export default function BusinessMonitoring({ websiteId, timeConfig, tagFilters }: BusinessMonitoringProps) {
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
          <PagesTopList
            tagFilters={tagFilters}
            timeConfig={timeConfig}
            websiteId={websiteId}
            urlMatrixParamConfig={{ path: summaryTab, paramTab: 'pagesTab' }}
            renderHistoricDataIndicator
          />
        </Col>
      </Row>
    </>
  );
}
