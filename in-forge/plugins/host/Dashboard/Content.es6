import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import {start} from 'in-forge/plugins/instanaAgent/selfMonitoring';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import ChartWithLegend from 'in-components/ChartWithLegend';
import MetricValue from 'in-components/MetricValue';
import Button from 'in-components/Button';
import {getLabel} from 'in-sdk/snapshot';

import './Content.less';

const block = 'in-forge-host-dashboard';

export default function HostDashboard({snapshot, timeframe}) {
  const swapTotal = snapshot.getIn(['data', 'swap.total'], 0);
  const memoryTotal = snapshot.getIn(['data', 'memory.total'], 0.000001); // avoid devision by zero errors

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>

        <KpiKeyValue label='CPU Usage'>
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='cpu.idle'
                       formatter={idle => percentageZeroDecimalPlaces(1 - idle)} />
        </KpiKeyValue>

        <KpiKeyValue label='Memory Usage'>
          <MetricValue snapshotId={snapshot.get('id')}
                       metric='memory.free'
                       formatter={free => percentageZeroDecimalPlaces(1 / memoryTotal * (memoryTotal - free))} />
        </KpiKeyValue>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title='CPU Usage'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           margins={{
                             left: 60
                           }}
                           y1={{
                             min: 0,
                             max: 1,
                             formatter: percentageZeroDecimalPlaces,
                             metrics: [
                               'cpu.user',
                               'cpu.sys',
                               'cpu.wait',
                               'cpu.nice',
                               'cpu.steal'
                             ],
                             labels: [
                               'User',
                               'System',
                               'Wait',
                               'Nice',
                               'Steal'
                             ],
                             type: 'stackedArea'
                           }}/>
        </DashboardSection>

        {!isWindows(snapshot) ?
          <DashboardSection title='CPU Load'>
            <ChartWithLegend snapshotId={snapshot.get('id')}
                             timeframe={timeframe}
                             margins={{
                               left: 60
                             }}
                             y1={{
                               min: 0,
                               type: 'stackedArea',
                               formatter: twoDecimalPlaces,
                               tooltipFormatter: twoDecimalPlaces,
                               metrics: [
                                 'load.1min'
                               ],
                               labels: ['Load']
                             }}/>
          </DashboardSection>
        : null}
      </TwoColumnRow>

      <CpuTable snapshot={snapshot} timeframe={timeframe} />

      <DashboardSection title='Memory Free'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}

                         margins={{
                           left: 80
                         }}
                         y1={{
                           min: 0,
                           max: memoryTotal,
                           formatter: bytesZeroDecimalPlaces,
                           tooltipFormatter: bytesTwoDecimalPlaces,
                           metrics: [
                             'memory.free'
                           ],
                           labels: ['Free'],
                           type: 'stackedArea'
                         }}/>
      </DashboardSection>

      {swapTotal > 0 ?
        <DashboardSection title='Swap Activity'>
          <ChartWithLegend snapshotId={snapshot.get('id')}
                           timeframe={timeframe}
                           margins={{
                             left: 90
                           }}
                           y1={{
                             min: 0,
                             formatter: twoDecimalPlaces,
                             metrics: [
                               'swap.pgin',
                               'swap.pgout'
                             ],
                             labels: [
                               'Page-In',
                               'Page-Out'
                             ],
                             type: 'line'
                           }}/>
        </DashboardSection>
      : null}

      <FilesystemsTable snapshot={snapshot} timeframe={timeframe}/>

      <NetworkInterfacesTable snapshot={snapshot} timeframe={timeframe} />

      <DashboardSection title='TCP Activity'>
        <ChartWithLegend snapshotId={snapshot.get('id')}
                         timeframe={timeframe}
                         y1={{
                           type: 'line',
                           metrics: [
                             'tcp.established',
                             'tcp.opens',
                             'tcp.inSegs',
                             'tcp.outSegs'
                           ],
                           labels: [
                             'Established',
                             'Open/s',
                             'In Segments/s',
                             'Out Segments/s'
                           ],
                           formatter: zeroDecimalPlaces,
                           tooltipFormatter: twoDecimalPlaces
                         }}
                         y2={{
                           type: 'line',
                           metrics: [
                             'tcp.establishedResets',
                             'tcp.resets',
                             'tcp.fails',
                             'tcp.errors',
                             'tcp.retrans'
                           ],
                           labels: [
                             'Established Resets',
                             'Out Resets',
                             'Fail',
                             'Error',
                             'Retransmission'
                           ],
                           min: 0,
                           max: 1,
                           formatter: percentageZeroDecimalPlaces
                         }}
                         margins={{
                           right: 60,
                           left: 80
                         }}/>
      </DashboardSection>

      <ProcessTopList snapshotId={snapshot.get('id')} />

      <DashboardSection title='Agent Self Monitoring'>
        <div className={`${block}__self-monitoring`}>
          <div className={`${block}__self-monitoring-description`}>
            <p>
              The Instana Agent has self monitoring capabilities which can be used to be inspect the state of the
              agent for debugging purposes. This is helpful to inspect running sensor versions, as well as discovery
              times and inventory listings. On top of this, the agent log file can be viewed for convenience via the
              Instana UI on the click of the button.
            </p>
            <p>
              Instana Agent self monitoring can be enabled via a click of the button to the right. After a few seconds,
              an Instana agent entity will appear on the map and in the Host entity sidebar.
            </p>
          </div>

          <div className={`${block}__self-monitoring-controls`}>
            <Button onClick={() => start(snapshot)}>
              Enable self monitoring
            </Button>
          </div>
        </div>
      </DashboardSection>
    </div>
  );
}

function isWindows(snapshot) {
  return !!snapshot.getIn(['data', 'os.name'], '').match(/windows/i);
}
