/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error needs migration to TS
import PagesTopList from 'in-websites/WebsiteDashboard/tabs/Summary/PagesTopList';
import SessionsChart from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/SessionsChart';
import UsersChart from 'in-websites/WebsiteDashboard/tabs/BusinessImpact/components/UsersChart';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { summaryTab, websitePath } from 'in-websites/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function GoalSummary() {
  const timeConfig = useTimeConfig();
  const location = useLocation();
  const websiteId = getMatrixParameter(location, websitePath, 'websiteId')!;

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
