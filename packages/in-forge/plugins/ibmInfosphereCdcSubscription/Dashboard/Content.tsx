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
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection/KpiSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number, bytes, millis, seconds } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

interface IbmInfosphereSubscriptionDashboardProps {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}

const IbmInfosphereSubscriptionDashboard = ({ snapshot, timeConfig }: IbmInfosphereSubscriptionDashboardProps) => {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceDatastoreTimeCheckMissed')}>
          <MetricValue snapshotId={snapshotId} metric="sourceDatastoreTimeCheckMissed" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmInfosphereCdcSubscription.sourceDatastoreNetworkError')}>
          <MetricValue snapshotId={snapshotId} metric="sourceDatastoreNetworkError" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetDatastoreTimeCheckMissed')}>
          <MetricValue snapshotId={snapshotId} metric="targetDatastoreTimeCheckMissed" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.ibmInfosphereCdcSubscription.targetDatastoreNetworkError')}>
          <MetricValue snapshotId={snapshotId} metric="targetDatastoreNetworkError" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
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
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.dashboard.memory')}>
        <Columize>
          <Card title={t('in-forge:plugins.ibmInfosphereCdcSubscription.source')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes.compact,
                metrics: [
                  'sourceDatastoreFreeMemory',
                  'sourceDatastoreMaxMemory',
                  'sourceDatastoreTotalMemory',
                  'sourceDatastoreGlobalMemory'
                ],
                labels: [
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.freeMem'),
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.maxMem'),
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.totalMem'),
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.globalMem')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card title={t('in-forge:plugins.ibmInfosphereCdcSubscription.target')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                formatter: bytes.compact,
                metrics: [
                  'targetDatastoreFreeMemory',
                  'targetDatastoreMaxMemory',
                  'targetDatastoreTotalMemory',
                  'targetDatastoreGlobalMemory'
                ],
                labels: [
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.freeMem'),
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.maxMem'),
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.totalMem'),
                  t('in-forge:plugins.ibmInfosphereCdcSubscription.globalMem')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
      </DashboardSection>
      <DashboardSection>
        <Row verticallyStretchColumns>
          <Col lg={6}>
            <Card
              title={t('in-forge:plugins.ibmInfosphereCdcSubscription.dashboard.databaseWorkload')}
              useMaxAvailableHeight
            >
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: number.compact,
                  metrics: ['dbTotalTransaction', 'dbInscopeTransaction'],
                  labels: [
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.totalTransactions'),
                    t('in-forge:plugins.ibmInfosphereCdcSubscription.inscopeTransactions')
                  ],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
          <Col lg={6}>
            <Card
              title={t('in-forge:plugins.ibmInfosphereCdcSubscription.dashboard.garbageCollection')}
              useMaxAvailableHeight
            >
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  formatter: number.compact,
                  metrics: ['sourceDatastoreGarbageCount'],
                  labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.garbageCollection')],
                  type: 'line'
                }}
                y2={{
                  formatter: millis.compact,
                  metrics: ['sourceDatastoreGarbageCPU'],
                  labels: [t('in-forge:plugins.ibmInfosphereCdcSubscription.garbageCollectionCPU')],
                  type: 'line'
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </Card>
          </Col>
        </Row>
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.dashboard.transactionHistogram')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: [
              'histogramZeroToHalfX',
              'histogramHalfToOneX',
              'histogramOneToTwoX',
              'histogramTwoToFourX',
              'histogramFourToEightX',
              'histogramEightXPlus'
            ],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.zeroToHalf'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.halfToOne'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.oneToTwo'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.twoToFour'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.fourToEight'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.moreThanEight')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
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
      <DashboardSection title={t('in-forge:plugins.ibmInfosphereCdcSubscription.dashboard.singleScrape')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['scrapeDiskWrites', 'scrapeDiskReads', 'scrapeDiskSize'],
            labels: [
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskWrites'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskReads'),
              t('in-forge:plugins.ibmInfosphereCdcSubscription.diskSize')
            ],
            type: 'line',
            formatter: bytes.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
};

export default IbmInfosphereSubscriptionDashboard;
