/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';
import { Card } from '@instana/components';

//@ts-expect-error
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface IbmInfosphereSubscriptionDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmInfosphereSubscriptionDashboard = ({ snapshot, timeConfig }: IbmInfosphereSubscriptionDashboardProps) => {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngine')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['preFilterInserts', 'preFilterUpdates', 'preFilterDeletes'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterInserts'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterUpdates'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.preFilterDeletes'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterInserts'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterUpdates'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.postFilterDeletes')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection>
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApplyFilters')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: number.compact,
                  metrics: ['targetApplyInserts', 'targetApplyUpdates', 'targetApplyDeletes'],
                  labels: [
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetInserts'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetUpdates'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetDeletes')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngineFilters')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: number.compact,
                  metrics: ['targetEngineInserts', 'targetEngineUpdates', 'targetEngineDeletes'],
                  labels: [
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetInserts'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetUpdates'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetDeletes')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.logParser')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['logParserDiskRead', 'logParserDiskWrite', 'logParserDiskSize'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskReads'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskWrites'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskSize')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.logReader')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['logSourceDBProcessed', 'logPhysicalBytesRead'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.databaseBytesProcessed'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.physicalBytesRead')
            ],
            type: 'line'
          }}
          y2={{
            formatter: number.compact,
            metrics: ['logThreadCpu'],
            labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.threadCpu')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
};

export default IbmInfosphereSubscriptionDashboard;
