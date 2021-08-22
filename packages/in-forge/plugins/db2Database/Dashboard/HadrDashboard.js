/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { millis, bytes } from 'in-services/formatters/number';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotProps = {};

export default connectTo(props => {
  snapshotProps = props;
  return {
    data: getRawPayloadWithTimestamp(props.snapshotId, 'hadrrole')
  };
}, HadrDashboard);

function HadrDashboard({ data }) {
  if (!data || !data.get('raw_payload')) {
    return null;
  }
  const { snapshotId, timeConfig } = snapshotProps;

  const hadrRole = data.get('raw_payload');
  if (hadrRole.get('HADR_ROLE') === 'PRIMARY') {
    return (
      <DashboardSection title={t('in-forge:plugins.db2Database.dashboard.hadrLogMetrics')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: [
              'hadrmetrics.sockSendBufReq"',
              'hadrmetrics.sockSendBufActual',
              'hadrmetrics.sockRecBufReq',
              'hadrmetrics.sockRecvBufAct'
            ],
            labels: [
              t('in-forge:plugins.db2Database.sockSendBufReq'),
              t('in-forge:plugins.db2Database.sockSendBufActual'),
              t('in-forge:plugins.db2Database.sockRecBufReq'),
              t('in-forge:plugins.db2Database.sockRecvBufAct')
            ],
            type: 'line',
            formatter: bytes.detailed
          }}
          y2={{
            min: 0,
            metrics: ['hadrmetrics.timeSinceLastRecv', 'hadrmetrics.logHadrWaitCur', 'hadrmetrics.logHadrWaitTime'],
            labels: [
              t('in-forge:plugins.db2Database.timeSinceLastRecv'),
              t('in-forge:plugins.db2Database.logHadrWaitCur'),
              t('in-forge:plugins.db2Database.logHadrWaitTime')
            ],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    );
  }
  return null;
}
