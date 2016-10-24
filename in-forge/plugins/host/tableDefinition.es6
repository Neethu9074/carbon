import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import {getSnapshot, getLabel} from 'in-stores/snapshot';
import {alwaysNull} from 'in-services/fixedStreams';
import {getZone} from 'in-stores/zone';

export default [
  {
    title: 'Zone',
    get(snapshot) {
      return getZone(snapshot.get('id'))
        .flatMap(zoneId => {
          if (zoneId) {
            return getSnapshot(zoneId);
          }
          return alwaysNull;
        })
        .map(zone => {
          if (!zone) {
            return zone;
          }
          return getLabel(zone);
        });
    }
  }, {
    title: 'FQDN',
    get(snapshot) {
      return snapshot.getIn(['data', 'fqdn'], snapshot.getIn(['data', 'hostname']));
    }
  }, {
    title: 'Hostname',
    get(snapshot) {
      return snapshot.getIn(['data', 'hostname']);
    }
  }, {
    title: 'OS',
    get(snapshot) {
      const data = snapshot.get('data');
      return `${data.get('os.name', '')} ${data.get('os.arch', '')} ${data.get('os.version', '')}`;
    }
  }, {
    title: '#CPUs',
    maxWidth: '5rem',
    get(snapshot) {
      return snapshot.getIn(['data', 'cpu.count']);
    }
  }, {
    title: 'CPU Usage',
    maxWidth: '5rem',
    get(snapshot) {
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'cpu.idle'
        })
        .map(v => 1 - v[1]);

      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               createMetricValueStream={() => valueStream}
                               formatter={percentageZeroDecimalPlaces}/>
        ),
        sortable: valueStream
      };
    }
  }, {
    title: 'Memory',
    maxWidth: '6.25rem',
    get(snapshot) {
      return bytesTwoDecimalPlaces(snapshot.getIn(['data', 'memory.total']));
    }
  }, {
    title: 'Memory Usage',
    maxWidth: '6.25rem',
    get(snapshot) {
      const memoryTotal = snapshot.getIn(['data', 'memory.total']);
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'memory.free'
        })
        .map(v => 1 / memoryTotal * (memoryTotal - v[1]));

      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               createMetricValueStream={() => valueStream}
                               formatter={percentageZeroDecimalPlaces}/>
        ),
        sortable: valueStream
      };
    }
  }
];
