import React from 'react';

import {bytesTwoDecimalPlaces, percentageZeroDecimalPlaces} from 'in-services/formatters/number';
import PercentageIndicator from 'in-sdk/components/table/PercentageIndicator';
import ImageAndLabel from 'in-sdk/components/table/ImageAndLabel';
import DashboardLink from 'in-components/Link/DashboardLink';
import {getMetricForFocusedMoment} from 'in-stores/metric';
import {alwaysNull} from 'in-services/fixedStreams';
import {getFoundations} from 'in-stores/snapshot';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import {always} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getZone} from 'in-stores/zone';

const nonVirtualized$ = always({
  content: '',
  sortable: ''
});

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
          <ImageAndLabel imgSrc={getIcon(snapshot)}
                         imgAlt='Operating System'>
            {data.get('os.version', '')} ({data.get('os.arch', '')})
          </ImageAndLabel>
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
                  <ImageAndLabel imgSrc={getIcon(foundation)}
                                 imgAlt='Instance hosting provider icon'>
                    {instanceType}
                  </ImageAndLabel>
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
          metric: 'cpu.used'
        })
        .map(v => v[1]);

      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               createMetricValueStream={() => valueStream}
                               formatter={percentageZeroDecimalPlaces} />
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
    title: 'Memory Used',
    style: {
      textAlign: 'right',
      maxWidth: '7.5rem'
    },
    sortableType: Number,
    defaultSortDirection: 'desc',
    get(snapshot) {
      const valueStream = getMetricForFocusedMoment({
          snapshotId: snapshot.get('id'),
          metric: 'memory.used'
        })
        .map(v => v[1]);

      return {
        content: (
          <PercentageIndicator snapshotId={snapshot.get('id')}
                               createMetricValueStream={() => valueStream}
                               formatter={percentageZeroDecimalPlaces} />
        ),
        sortable$: valueStream
      };
    }
  }
];
