/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

// import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
// import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

// import { Card } from '@instana/components';

// import { Row, Col } from 'in-components/layout/Grid';

export default function Summary({ data: hypervisor }) {
  const snapshotId = hypervisor.id;

  return (
    <Fragment>
      <KpiGridRow sizes={[3, 3]}>
        <InfraMetricKpiCard
          title={t('in-openstack:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpu.usage.percent.maximum.*"
          formatter={percentage.detailed}
        />

        <InfraMetricKpiCard
          title={t('in-openstack:dashboards.memoryUsage')}
          snapshotId={snapshotId}
          metric="mem.usage.average.percent"
          formatter={percentage.detailed}
        />
      </KpiGridRow>
    </Fragment>
  );
}
