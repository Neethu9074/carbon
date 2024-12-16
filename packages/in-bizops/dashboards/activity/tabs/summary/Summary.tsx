/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import DurationAndDistribution from 'in-bizops/dashboards/activity/tabs/summary/components/DurationAndDistribution';
import ActivityMetricKpiCard from 'in-bizops/dashboards/activity/tabs/summary/components/ActivityMetricKpiCard';
import ActivityLatencyChart from 'in-bizops/dashboards/activity/tabs/summary/components/ActivityLatencyChart';
import ActivityErrorsChart from 'in-bizops/dashboards/activity/tabs/summary/components/ActivityErrorsChart';
import TopServices from 'in-bizops/dashboards/activity/tabs/summary/components/TopServices';
import { businessActivityPath, businessProcessDashboard } from 'in-bizops/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import BizOpsCountChart from 'in-bizops/components/BizOpsCountChart';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
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
  const businessActivityId: string =
    getMatrixParameter(location, businessActivityPath, 'activityId') ?? t('in-bizops:dashboards.summary.pageTitle');

  return (
    <Fragment>
      <KpiGridRow sizes={[true, true]}>
        <ActivityMetricKpiCard
          title={t('in-bizops:dashboards.activity.widgets.activityCount')}
          metric="COUNT"
          timeConfig={timeConfig}
          processId={businessProcessId}
          activityName={businessActivityName}
        />
        <ActivityMetricKpiCard
          title={t('in-bizops:dashboards.activity.widgets.activityErrors')}
          metric="ERRORS"
          timeConfig={timeConfig}
          processId={businessProcessId}
          activityName={businessActivityName}
        />
      </KpiGridRow>
      <Row>
        <Col lg>
          <BizOpsCountChart
            timeShiftConfig={timeShiftConfig}
            timeConfig={timeConfig}
            businessProcessId={businessProcessId}
            businessProcessName={businessProcessName}
            businessActivityName={businessActivityName}
            metric={'activities_count'}
            label={businessActivityName}
            dataSource={'BUSINESS_ACTIVITIES'}
          />
        </Col>
        <Col lg>
          <TopServices businessActivityId={businessActivityId} businessProcessDefinitionId={businessProcessId} />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <InfrastructureIssuesAndChanges
            businessProcessId={businessProcessId}
            businessProcessName={businessProcessName}
          />
        </Col>
        <Col lg>
          <ActivityErrorsChart processId={businessProcessId} activityName={businessActivityName} />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <ActivityLatencyChart processId={businessProcessId} activityName={businessActivityName} />
        </Col>
        <Col lg>
          <DurationAndDistribution />
        </Col>
      </Row>
    </Fragment>
  );
}
