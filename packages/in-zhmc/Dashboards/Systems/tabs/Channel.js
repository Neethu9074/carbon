/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Card } from '@instana/components';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import FlashMemoryUsageTable from '../../tables/FlashMemoryUsageTable';
import ChannelUsageTable from '../../tables/ChannelUsageTable';
import CryptoUsageTable from '../../tables/CryptoUsageTable';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import NoData from '../../commonComponents/NoData';
import { t } from 'in-i18n';

export default function Channel({ timeConfig, data: cpc }) {
  const snapshotId = cpc.id;
  if (cpc.dpmEnabled === 'false') {
    return (
      <Fragment>
        <Row verticallyStretchColumns>
          <Col lg={12}>
            <Card title={t('in-zhmc:dashboards.channelUsage')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['channelUsage'],
                  labels: [t('in-zhmc:channelUsage')],
                  formatter: number.detailed,
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
        <br />
        <ChannelUsageTable snapshotId={cpc.id} />
        <CryptoUsageTable snapshotId={cpc.id} />
        <FlashMemoryUsageTable snapshotId={cpc.id} />
      </Fragment>
    );
  } else {
    return <NoData />;
  }
}
