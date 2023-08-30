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
import FlashMemoryUsageTable from '../../tables/FlashMemoryUsageTable';
// @ts-expect-error Module needs to be translated to TS
import ChannelUsageTable from '../../tables/ChannelUsageTable';
// @ts-expect-error Module needs to be translated to TS
import CryptoUsageTable from '../../tables/CryptoUsageTable';
// @ts-expect-error Module needs to be translated to TS
import NoData from '../../commonComponents/NoData';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import { Row, Col } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface ChannelProps {
  timeConfig: TimeConfig;
  data: {
    id: string;
    dpmEnabled: string;
  };
}

const Channel: React.FC<ChannelProps> = ({ timeConfig, data: cpc }) => {
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
};

export default Channel;
