/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import TopActivities from 'in-bizops/dashboards/summary/tabs/summary/components/TopActivities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import BizOpsCountChart from 'in-bizops/components/BizOpsCountChart';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function Summary() {
  const timeShiftConfig = useTimeShiftConfig();
  const timeConfig = useTimeConfig();

  // Get the business process name from the URL
  const location = useLocation();
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
          <BizOpsCountChart
            timeShiftConfig={timeShiftConfig}
            timeConfig={timeConfig}
            businessProcessName={businessProcessName}
            businessProcessId={businessProcessId}
            metric={'started_processes'}
            label={businessProcessName}
            dataSource={'BUSINESS_PROCESSES'}
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
