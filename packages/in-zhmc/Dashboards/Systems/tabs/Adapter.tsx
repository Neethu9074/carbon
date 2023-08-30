/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error Module needs to be translated to TS
import AdpaterUsageTable from 'in-zhmc/Dashboards/tables/AdapterUsageTable';
// @ts-expect-error Module needs to be translated to TS
import RoceAdapter from 'in-zhmc/Dashboards/tables/RoceAdapter';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface AdapterProps {
  timeConfig: TimeConfig;
  data: {
    id: string;
    dpmEnabled: string;
  };
}

const Adapter: React.FC<AdapterProps> = ({ timeConfig, data: cpc }) => {
  const snapshotId = cpc.id;
  if (cpc.dpmEnabled === 'true') {
    return (
      <Fragment>
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title={t('in-zhmc:storageUsage')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['storageUsage'],
                  labels: [t('in-zhmc:storageUsage')],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title={t('in-zhmc:networkUsage')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['networkUsage'],
                  labels: [t('in-zhmc:networkUsage')],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title={t('in-zhmc:acceleratorUsage')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['acceleratorUsage'],
                  labels: [t('in-zhmc:acceleratorUsage')],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title={t('in-zhmc:cryptoUsage')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['dpmCryptoUsage'],
                  labels: [t('in-zhmc:cryptoUsage')],
                  formatter: percentage.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
        <AdpaterUsageTable snapshotId={cpc.id} />
      </Fragment>
    );
  } else {
    return <RoceAdapter snapshotId={cpc.id} />;
  }
};

export default Adapter;
