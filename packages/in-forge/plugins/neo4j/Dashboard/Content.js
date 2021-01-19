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

      <DashboardSection title="ID Allocation">
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
            labels: ['Node IDs', 'Property IDs', 'Relationship IDs', 'RelationShipType IDs'],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      {hasPageCache && (
        <Columize>
          <DashboardSection title="Bytes Read">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.compact,
                metrics: ['pageCache.bytesRead'],
                labels: ['Bytes Read'],
                type: 'area'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection title="Bytes Written">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.compact,
                metrics: ['pageCache.bytesWritten'],
                labels: ['Bytes Written'],
                type: 'area'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      )}

      {hasStoreSizeMetrics && (
        <DashboardSection title="Store Sizes">
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
                'Nodes',
                'Properties',
                'Relationships',
                'Labels',
                'String Properties',
                'Array Properties',
                'Schemas',
                'Counters',
                'Indices',
                'Transaction Logs',
                'Total Store'
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}
      {hasStoreFileSizeMetrics && (
        <DashboardSection title="Store File Sizes">
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
                'Nodes',
                'Properties',
                'Relationships',
                'String Properties',
                'Array Properties',
                'Logical Log',
                'Total Store'
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {hasTransactions && (
        <DashboardSection title="Transactions">
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
              labels: ['Open', 'Opened', 'Committed', 'Rolled Back', 'Peak Concurrent'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {hasPageCache && (
        <DashboardSection title="Page Cache">
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
                'Pins',
                'Flushes',
                'Faults',
                'Evictions',
                'Eviction Exceptions',
                'File Mappings',
                'File Unmappings'
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
