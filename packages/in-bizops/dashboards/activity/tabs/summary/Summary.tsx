/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/activity/tabs/summary/components/InfrastructureIssuesAndChanges';
import { businessActivityPath, businessProcessDashboard } from 'in-bizops/navigation/paths';
import Duration from 'in-bizops/dashboards/activity/tabs/summary/components/Duration';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import BizOpsCountChart from 'in-bizops/components/BizOpsCountChart';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { Location } from 'in-stores/navigation/types';
import { Col, Row } from 'in-components/layout/Grid';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export default function Summary() {
  const timeShiftConfig = useTimeShiftConfig();
  const timeConfig = useTimeConfig();

  // Get necessary params from the URL to pass down as props to widgets
  const location: Location = useLocation();
  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessProcessName: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionName') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessActivityName: string =
    getMatrixParameter(location, businessActivityPath, 'activityName') ?? t('in-bizops:dashboards.summary.pageTitle');

  return (
    <Fragment>
      <Row>
        <Col xs>
          <BizOpsCountChart
            timeShiftConfig={timeShiftConfig}
            timeConfig={timeConfig}
            businessProcessId={businessProcessId}
            businessProcessName={businessProcessName}
            businessActivityName={businessActivityName}
            metric={'activitiesCount'}
            label={businessActivityName}
            dataSource={'BUSINESS_ACTIVITIES'}
          />
        </Col>
        <Col xs>
          <Duration />
        </Col>
        <Col xs>
          <InfrastructureIssuesAndChanges />
        </Col>
      </Row>
    </Fragment>
  );
}
