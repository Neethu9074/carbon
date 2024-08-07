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
import { number, bytes, millis, seconds } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import { t } from 'in-i18n';

interface IbmInfosphereSubscriptionDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmInfosphereSubscriptionDashboard = ({ snapshot, timeConfig }: IbmInfosphereSubscriptionDashboardProps) => {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardSection>
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card title={t('in-forge:plugins.ibmInfosphereCdcSubscription.latency')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: seconds.fixedCompact,
                  metrics: ['sourceLatency', 'targetLatency'],
                  labels: [
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngine'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApply')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card title={t('in-forge:plugins.ibmInfosphereCdcSubscription.networkLatency')} useMaxAvailableHeight>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: millis.compact,
                  metrics: ['sourceNetworkLatency', 'targetNetworkLatency'],
                  labels: [
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceNetwork'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.targetNetwork')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngine')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'preFilterInserts',
              'preFilterUpdates',
              'preFilterDeletes',
              'postFilterInserts',
              'postFilterUpdates',
              'postFilterDeletes'
            ],
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

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.rows')}>
        <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngine')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['sourceRowsDerivedCols', 'sourceRowsCallingSource', 'sourceRowsUserExits'],
              labels: [
                t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsEvaluatingDerivedCols'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingDatabase'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingUserExits')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngine')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['targetRowsExpressions', 'targetRowsCallingTarget', 'targetRowsUserExits'],
              labels: [
                t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsEvaluatingExpressions'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingDatabase'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.rowsCallingUserExits')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.mbcsConversions')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytes.compact,
            metrics: ['sourceMbcs', 'targetMbcs'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngine'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngine')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.logParser')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytes.compact,
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
            formatter: bytes.compact,
            metrics: ['logSourceDBProcessed', 'logPhysicalBytesRead'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.databaseBytesProcessed'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.physicalBytesRead')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.communications')}>
        <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.source')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['sourceMissResponse', 'keepAliveSent', 'commByteSent'],
              labels: [
                t('in-forge:plugins.ibmInfosphereCdcSubscription.missingRoundTripResponse'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.keepAliveSent'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.bytesSent')
              ],
              type: 'line'
            }}
            y2={{
              formatter: bytes.compact,
              metrics: ['commSourceBytes'],
              labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceCommunicationsBytesProcessed')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.target')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['targetMissResponse', 'keepAliveReceived', 'commByteReceived'],
              labels: [
                t('in-forge:plugins.ibmInfosphereCdcSubscription.missingRoundTripResponse'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.keepAliveReceived'),
                t('in-forge:plugins.ibmInfosphereCdcSubscription.bytesReceived')
              ],
              type: 'line'
            }}
            y2={{
              formatter: bytes.compact,
              metrics: ['commTargetBytes'],
              labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.targetCommunicationsBytesProcessed')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.threadCpu')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [
              'sourceEngineThreadCpu',
              'targetEngineThreadCpu',
              'targetApplyThreadCpu',
              'logThreadCpu',
              'logParserThreadCpu'
            ],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceEngine'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetEngine'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.targetApply'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.logReader'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.logParser')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
};

export default IbmInfosphereSubscriptionDashboard;
