/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import InfrastructureIssuesAndChanges from 'in-bizops/dashboards/summary/tabs/summary/components/InfrastructureIssuesAndChanges';
import TopActivities from 'in-bizops/dashboards/summary/tabs/summary/components/TopActivities';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import BizOpsLatencyChart from 'in-bizops/components/BizOpsLatencyChart';
import BizOpsErrorsChart from 'in-bizops/components/BizOpsErrorsChart';
import { businessProcessDashboard } from 'in-bizops/navigation/paths';
import ProcessMetricKpiCard from './components/ProcessMetricsKpiCard';
import { bizopsGoldenSignalsEnabled } from 'in-services/featureFlags';
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
      {bizopsGoldenSignalsEnabled && (
        <KpiGridRow sizes={[true, true]}>
          <ProcessMetricKpiCard title={t('in-bizops:dashboards.summary.widgets.processCount')} />
          <ProcessMetricKpiCard title={t('in-bizops:dashboards.summary.widgets.processErrors')} />
        </KpiGridRow>
      )}
      <Row>
        <Col lg>
          <BizOpsCountChart
            timeShiftConfig={timeShiftConfig}
            timeConfig={timeConfig}
            businessProcessName={businessProcessName}
            businessProcessId={businessProcessId}
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
        {bizopsGoldenSignalsEnabled && (
          <Col lg>
            <BizOpsErrorsChart />
          </Col>
        )}
      </Row>
      <Row>
        {bizopsGoldenSignalsEnabled && (
          <Col lg>
            <BizOpsLatencyChart />
          </Col>
        )}
      </Row>
    </Fragment>
  );
}
