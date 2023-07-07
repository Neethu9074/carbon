/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import TopActivities from 'in-bizops/dashboards/summary/tabs/summary/components/TopActivities';
import Count from 'in-bizops/dashboards/summary/tabs/summary/components/Count';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { TimeShift } from 'in-components/Chart/types';
import { Location } from 'in-stores/navigation/types';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary() {
  const timeShiftConfig: TimeShift = useTimeShiftConfig();

  // Get the business process name from the URL
  const location: Location = useLocation();
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');

  return (
    <Fragment>
      <Row>
        <Col xs>
          <Count
            timeShiftConfig={timeShiftConfig}
            businessProcessName={businessProcessName}
            businessProcessId={businessProcessId}
          />
        </Col>
        <Col xs>
          <TopActivities businessProcessId={businessProcessId} businessProcessName={businessProcessName} />
        </Col>
        <Col xs>
          <InfrastructureIssuesAndChanges
            businessProcessId={businessProcessId}
            businessProcessName={businessProcessName}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
