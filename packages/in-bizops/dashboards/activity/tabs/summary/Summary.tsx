/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import DurationAndDistribution from 'in-bizops/dashboards/activity/tabs/summary/components/DurationAndDistribution';
import { businessActivityPath, businessProcessDashboard } from 'in-bizops/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import BizOpsCountChart from 'in-bizops/components/BizOpsCountChart';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { bizopsActivityDistributionChartsEnabled } from 'in-services/featureFlags';
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
        <Col lg>
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
        {bizopsActivityDistributionChartsEnabled && (
          <Col lg>
            <DurationAndDistribution />
          </Col>
        )}
        <Col lg>
          <InfrastructureIssuesAndChanges
            businessProcessId={businessProcessId}
            businessProcessName={businessProcessName}
          />
        </Col>
      </Row>
    </Fragment>
  );
}
