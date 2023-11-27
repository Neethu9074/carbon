/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import PageRateTable from 'in-sap/Dashboards/SapAbapSystemSensor/tables/PageRateTable';
import CpuTable from 'in-sap/Dashboards/SapAbapSystemSensor/tables/CpuTable';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

export default function Summary({ timeConfig, data: sap }) {
  const snapshotId = sap.id;
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <InfraMetricKpiCard
          title={t('in-sap:abapSystemsensor.noOfMonitoringInstances')}
          snapshotId={snapshotId}
          metric="numberOfInstances"
          formatter={number.compact}
        />
      </KpiGridRow>

      <Row>
        <Col lg>
          <CpuTable snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
        <Col lg>
          <PageRateTable snapshotId={snapshotId} timeConfig={timeConfig} />
        </Col>
      </Row>
    </>
  );
}
