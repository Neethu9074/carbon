/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  millis,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  timeByMicroTwoDecimalPlaces
} from 'in-services/formatters/number';
import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    kafkaNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"kafka-*"',
        timeConfig,
        restrictResultEntityType: 'kafka'
      })
    ),
    jvmNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"kafka-*"',
        timeConfig,
        restrictResultEntityType: 'jvmRuntimePlatform'
      })
    )
  },
  function Overview({ kafkaNodes, jvmNodes, timeConfig }) {
    if (!kafkaNodes || !jvmNodes) {
      return <LoadingIndicator />;
    }

    if (kafkaNodes.length < 1) {
      return <div>{t('in-internal:monitoringUnit.sre.kafka.statisticsProviderNotFound')}</div>;
    }
    if (jvmNodes.length < 1) {
      return <div>{t('in-internal:monitoringUnit.sre.kafka.statisticsProviderNotFound')}</div>;
    }

    kafkaNodes = sort(kafkaNodes);
    const kafkaNodeLabels = getLabels(kafkaNodes, /^((kafka)-\d+).*$/i);

    return (
      <div>
        <h2>{t('in-internal:monitoringUnit.sre.kafka.kafkaNodes', { count: kafkaNodes.length })}</h2>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.brokerTrafficBytesIn')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.bytesIn`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.brokerTrafficBytesOut')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.bytesOut`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.brokerTrafficByteReject')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.bytesRejected`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.messagesIn')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.messagesIn`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.produceReq')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.produceRequests`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.networkProcessorIdle')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: percentageZeroDecimalPlaces,
                tooltipFormatter: percentageZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.networkProcessorIdle`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.reqHandlerIdle')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: percentageZeroDecimalPlaces,
                tooltipFormatter: percentageZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.requestHandlerIdle`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.g1YoungGeneration')}>
            <Chart
              snapshotIds={jvmNodes.map(r => r.jvmRuntimePlatform.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: millis.compact,
                metrics: jvmNodes.map(() => 'gc.G1 Young Generation.time'),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.suspension')}>
            <ChartExplanation>{t('in-internal:monitoringUnit.sre.kafka.suspensionChartExplanation')}</ChartExplanation>
            <Chart
              snapshotIds={jvmNodes.map(r => r.jvmRuntimePlatform.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMicroTwoDecimalPlaces,
                metrics: jvmNodes.map(() => 'suspension.time'),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.networkDataReceive')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `ifs.eth0.rx.bytes`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.networkDataTransmit')}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `ifs.eth0.tx.bytes`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.cpuUsage')}>
            <Table
              cols={hostTableCols}
              rows={kafkaNodes.map(node => ({ key: node.kafka.get('id'), timeConfig, ...node }))}
              getRowDetails={getHostDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.kafka.dataMount')}>
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(
                kafkaNodes.map(node => ({ key: node.kafka.get('id'), ...node })),
                timeConfig
              )}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getLabels(rows, regexp) {
  return rows.map(r => r.host.get('label').replace(regexp, '$1'));
}
