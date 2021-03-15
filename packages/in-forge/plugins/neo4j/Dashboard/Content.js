/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytes, number, siPrefix } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import isAtLeastMinorVersion from '../Neo4jVersion.js';
import NodeSummary from '../NodeSummary.js';
import { t } from 'in-i18n';

export default function Neo4jDashboard({ snapshot, timeConfig }) {
  // we just want to show one of the store size metrics (or none, if the snapshot data is undefined)
  const dataStoreSizeMetrics = snapshot.getIn(['data', 'hasStoreSizeMetrics']);
  const hasStoreSizeMetrics = dataStoreSizeMetrics != undefined && dataStoreSizeMetrics;
  const hasStoreFileSizeMetrics = dataStoreSizeMetrics != undefined && !hasStoreSizeMetrics;
  const version = snapshot.getIn(['data', 'version']);
  const isAtLeastMinorVersion3 = isAtLeastMinorVersion(version, 3, 3);
  const hasPageCache = isAtLeastMinorVersion3;
  const hasTransactions = isAtLeastMinorVersion3;

  return (
    <div>
      <NodeSummary snapshot={snapshot} />

      <DashboardSection title={t('in-forge:plugins.neo4j.idAllocation')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: siPrefix.compact,
            tooltipFormatter: siPrefix.compact,
            metrics: [
              'primitiveCount.nodeIds',
              'primitiveCount.propertyIds',
              'primitiveCount.relationshipIds',
              'primitiveCount.relationShipTypeIds'
            ],
            labels: [
              t('in-forge:plugins.neo4j.nodeIDs'),
              t('in-forge:plugins.neo4j.propertyIDs'),
              t('in-forge:plugins.neo4j.relationshipIDs'),
              t('in-forge:plugins.neo4j.relationShipTypeIDs')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {hasPageCache && (
        <Columize>
          <DashboardSection title={t('in-forge:plugins.neo4j.bytesRead')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.compact,
                metrics: ['pageCache.bytesRead'],
                labels: [t('in-forge:plugins.neo4j.bytesRead')],
                type: 'area'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title={t('in-forge:plugins.neo4j.bytesWritten')}>
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.compact,
                metrics: ['pageCache.bytesWritten'],
                labels: [t('in-forge:plugins.neo4j.bytesWritten')],
                type: 'area'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      )}

      {hasStoreSizeMetrics && (
        <DashboardSection title={t('in-forge:plugins.neo4j.storeSizes')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytes.compact,
              metrics: [
                'storeSize.nodeStoreSize',
                'storeSize.propertyStoreSize',
                'storeSize.relationshipStoreSize',
                'storeSize.labelStoreSize',
                'storeSize.stringStoreSize',
                'storeSize.arrayStoreSize',
                'storeSize.schemaStoreSize',
                'storeSize.countStoreSize',
                'storeSize.indexStoreSize',
                'storeSize.transactionLogsSize',
                'storeSize.totalStoreSize'
              ],
              labels: [
                t('in-forge:plugins.neo4j.nodes'),
                t('in-forge:plugins.neo4j.properties'),
                t('in-forge:plugins.neo4j.relationships'),
                t('in-forge:plugins.neo4j.labels'),
                t('in-forge:plugins.neo4j.stringProperties'),
                t('in-forge:plugins.neo4j.arrayProperties'),
                t('in-forge:plugins.neo4j.schemas'),
                t('in-forge:plugins.neo4j.counters'),
                t('in-forge:plugins.neo4j.indices'),
                t('in-forge:plugins.neo4j.transactionLogs'),
                t('in-forge:plugins.neo4j.totalStore')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      {hasStoreFileSizeMetrics && (
        <DashboardSection title={t('in-forge:plugins.neo4j.storeFileSizes')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytes.compact,
              metrics: [
                'storeFileSize.nodeStoreSize',
                'storeFileSize.propertyStoreSize',
                'storeFileSize.relationshipStoreSize',
                'storeFileSize.stringStoreSize',
                'storeFileSize.arrayStoreSize',
                'storeFileSize.logicalLogSize',
                'storeFileSize.totalStoreSize'
              ],
              labels: [
                t('in-forge:plugins.neo4j.nodes'),
                t('in-forge:plugins.neo4j.properties'),
                t('in-forge:plugins.neo4j.relationships'),
                t('in-forge:plugins.neo4j.stringProperties'),
                t('in-forge:plugins.neo4j.arrayProperties'),
                t('in-forge:plugins.neo4j.logicalLog'),
                t('in-forge:plugins.neo4j.totalStore')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {hasTransactions && (
        <DashboardSection title={t('in-forge:plugins.neo4j.transactions')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: [
                'transactions.openTransactions',
                'transactions.openedTransactions',
                'transactions.committedTransactions',
                'transactions.rolledBackTransactions',
                'transactions.peakConcurrentTransactions'
              ],
              labels: [
                t('in-forge:plugins.neo4j.open'),
                t('in-forge:plugins.neo4j.opened'),
                t('in-forge:plugins.neo4j.committed'),
                t('in-forge:plugins.neo4j.rolledBack'),
                t('in-forge:plugins.neo4j.peakConcurrent')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {hasPageCache && (
        <DashboardSection title={t('in-forge:plugins.neo4j.pageCache')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              tooltipFormatter: number.compact,
              metrics: [
                'pageCache.pins',
                'pageCache.flushes',
                'pageCache.faults',
                'pageCache.evictions',
                'pageCache.evictionExceptions',
                'pageCache.fileMappings',
                'pageCache.fileUnmappings'
              ],
              labels: [
                t('in-forge:plugins.neo4j.pins'),
                t('in-forge:plugins.neo4j.flushes'),
                t('in-forge:plugins.neo4j.faults'),
                t('in-forge:plugins.neo4j.evictions'),
                t('in-forge:plugins.neo4j.evictionExceptions'),
                t('in-forge:plugins.neo4j.fileMappings'),
                t('in-forge:plugins.neo4j.fileUnmappings')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
    </div>
  );
}
