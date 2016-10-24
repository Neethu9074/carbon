import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import AnnotatedHealthBar from 'in-components/AnnotatedHealthBar';
import LoadingIndicator from 'in-components/LoadingIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/snapshot';
import {getZone} from 'in-stores/zone';

import './TableRow.less';

const block = 'in-table-view-table-row';
const cellClassName = `${block}__cell`;

export default connectTo(props => {
  return {
    snapshot: getSnapshot(props.snapshotId),
    zone: getZone(props.snapshotId)
      .flatMap(zoneId => {
        if (zoneId) {
          return getSnapshot(zoneId);
        }
        return alwaysNull;
      })
  };
}, function TableRow({snapshot, zone}) {
  if (!snapshot) {
    return (
      <LoadingIndicator type='dark'
                        style={{
                          margin: '3px auto',
                          height: '20px'
                        }}/>
    );
  }

  const data = snapshot.get('data');
  const memoryTotal = data.get('memory.total');

  return (
    <div className={block}>
      <div className={cellClassName}>
        {zone ?
          <DashboardLink snapshotId={zone.get('id')}>
            {getLabel(zone)}
          </DashboardLink>
        : <span>&nbsp;</span>}
      </div>
      <div className={cellClassName}>
        <DashboardLink snapshotId={snapshot.get('id')}>
          {data.get('fqdn')}
        </DashboardLink>
      </div>
      <div className={cellClassName}>
        {data.get('hostname')}
      </div>
      <div className={cellClassName}>
        {data.get('os.name')}{' '}
        {data.get('os.arch')}{' '}
        {data.get('os.version')}
      </div>
      <div className={cellClassName}>
        {data.get('cpu.count')}
      </div>
      <div className={cellClassName}>
        <PercentageIndicator snapshotId={snapshot.get('id')}
                             createMetricValueStream={createCpuPercentageValueStream}
                             formatter={percentageZeroDecimalPlaces}/>
      </div>
      <div className={cellClassName}>
        {bytesTwoDecimalPlaces(memoryTotal)}
      </div>
      <div className={cellClassName}>
        <PercentageIndicator snapshotId={snapshot.get('id')}
                             createMetricValueStream={createMemoryUsagePercentageValueStream}
                             formatter={percentageZeroDecimalPlaces}/>
      </div>
      <div className={cellClassName}>
        <AnnotatedHealthBar snapshotId={snapshot.get('id')} />
      </div>
    </div>
  );
});


function createCpuPercentageValueStream(snapshotId) {
  return getMetricForFocusedMoment({
    snapshotId,
    metric: 'cpu.idle'
  })
  .map(v => 1 - v[1]);
}

function createMemoryUsagePercentageValueStream(snapshotId) {
  return getSnapshot(snapshotId)
    .map(snapshot => snapshot.getIn(['data', 'memory.total']))
    .distinct()
    .flatMap(memoryTotal => {
      return getMetricForFocusedMoment({
        snapshotId,
        metric: 'memory.free'
      })
      .map(v => 1 / memoryTotal * (memoryTotal - v[1]))
      .distinct();
    });
}
