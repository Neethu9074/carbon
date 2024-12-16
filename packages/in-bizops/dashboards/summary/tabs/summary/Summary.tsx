/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import ProcessMetricKpiCard from 'in-bizops/dashboards/summary/tabs/summary/components/ProcessMetricsKpiCard';
import ProcessLatencyChart from 'in-bizops/dashboards/summary/tabs/summary/components/ProcessLatencyChart';
import ProcessErrorsChart from 'in-bizops/dashboards/summary/tabs/summary/components/ProcessErrorsChart';
import TopActivities from 'in-bizops/dashboards/summary/tabs/summary/components/TopActivities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import BizOpsCountChart from 'in-bizops/components/BizOpsCountChart';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
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
      <KpiGridRow sizes={[true, true]}>
        <ProcessMetricKpiCard
          title={t('in-bizops:dashboards.summary.widgets.processCount')}
          metric="COUNT"
          timeConfig={timeConfig}
          processId={businessProcessId}
        />
        <ProcessMetricKpiCard
          title={t('in-bizops:dashboards.summary.widgets.processErrors')}
          metric="ERRORS"
          timeConfig={timeConfig}
          processId={businessProcessId}
        />
      </KpiGridRow>
      <Row>
        <Col lg>
          <BizOpsCountChart
            timeShiftConfig={timeShiftConfig}
            timeConfig={timeConfig}
            businessProcessName={businessProcessName}
            businessProcessId={businessProcessId}
            // this metric is mapped on the backend to started_processes
            metric={'startedProcessesCount'}
            label={businessProcessName}
            dataSource={'BUSINESS_PROCESSES'}
          />
        </Col>
        <Col lg>
          <TopActivities businessProcessId={businessProcessId} businessProcessName={businessProcessName} />
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
          <ProcessErrorsChart businessProcessId={businessProcessId} />
        </Col>
      </Row>
      <Row>
        <Col lg>
          <ProcessLatencyChart businessProcessId={businessProcessId} />
        </Col>
        <Col lg>
          <></>
        </Col>
      </Row>
    </Fragment>
  );
}
