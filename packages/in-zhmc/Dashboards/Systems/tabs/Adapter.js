/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import AdpaterUsageTable from '../../tables/AdapterUsageTable';
import { percentage } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import NoData from '../../commonComponents/NoData';
import { t } from 'in-i18n';

export default function Adapter({ timeConfig, data: cpc }) {
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
    return <NoData />;
  }
}
