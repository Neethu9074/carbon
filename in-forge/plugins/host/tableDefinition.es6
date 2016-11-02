import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import {alwaysNull} from 'in-services/fixedStreams';
import {getFoundations} from 'in-stores/snapshot';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {always} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getZone} from 'in-stores/zone';

import 'in-forge/plugins/host/tableDefinition.less';

const nonVirtualized$ = always({
  content: '',
  sortable: ''
});

const block = 'in-host-table';

export default [
  {
    title: 'Zone',
    sortableType: String,
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
            return {
              content: '',
              sortable: ''
            };
          }

          const zoneLabel = getLabel(zone);
          return {
            content: (
              <DashboardLink snapshotId={zone.get('id')}>
                {zoneLabel}
              </DashboardLink>
            ),
            sortable: zoneLabel
          };
        });
    }
  }, {
    title: 'FQDN',
    sortableType: String,
    get(snapshot) {
      const fqdn = snapshot.getIn(['data', 'fqdn'], snapshot.getIn(['data', 'hostname']));
      return {
        content: (
          <DashboardLink snapshotId={snapshot.get('id')}>
            {fqdn}
          </DashboardLink>
        ),
        sortable: fqdn
      };
    }
  }, {
    title: 'Hostname',
    sortableType: String,
    get(snapshot) {
      return snapshot.getIn(['data', 'hostname']);
    }
  }, {
    title: 'OS',
    sortableType: String,
    get(snapshot) {
      const data = snapshot.get('data');
      return {
        content: (
          <div className={`${block}__type`}>
            <img src={getIcon(snapshot)}
                 alt='Operating system'
                 className={`${block}__type-icon`}/>

            {data.get('os.version', '')} ({data.get('os.arch', '')})
          </div>
        ),
        sortable: `${data.get('os.name', '')} ${data.get('os.version', '')} (${data.get('os.arch', '')})`
      };
    }
  }, {
    title: 'Type',
    sortableType: String,
    style: {
      maxWidth: '8rem'
    },
    get(snapshot) {
      return getFoundations(snapshot.get('id'))
        .flatMap(foundations => {
          if (foundations.size === 0) {
            return nonVirtualized$;
          }

          const foundationId = foundations.first();
          return getSnapshot(foundationId)
            .map(foundation => {
              const instanceType = foundation.getIn(['data', 'instance-type']) || '';
              return {
                content: (
                  <div className={`${block}__type`}>
                    <img src={getIcon(foundation)}
                         alt='Instance hosting provider icon'
                         className={`${block}__type-icon`}/>

                    {instanceType}
                  </div>
                ),
                sortable: instanceType
              };
            });
        });
    }
  }, {
    title: '#CPUs',
    style: {
      textAlign: 'right',
      maxWidth: '6.5rem'
    },
    sortableType: Number,
    get(snapshot) {
      return snapshot.getIn(['data', 'cpu.count']);
    }
  }, {
    title: 'CPU Usage',
    style: {
      textAlign: 'right',
      maxWidth: '6.5rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
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
        sortable$: valueStream
      };
    }
  }, {
    title: 'Memory',
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    sortableType: Number,
    get(snapshot) {
      const memoryTotal = snapshot.getIn(['data', 'memory.total']);
      return {
        content: bytesTwoDecimalPlaces(memoryTotal),
        sortable: memoryTotal
      };
    }
  }, {
    title: 'Memory Usage',
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
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
        sortable$: valueStream
      };
    }
  }
];
