/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-phmc:vlanId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('vlanId');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:vswitchId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('vswitchId');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('sentPackets');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('receivedPackets');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:droppedPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('droppedPackets');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('sentBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('receivedBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('transferredBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:transferredPhysicalBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualEthernetAdapter.get('transferredPhysicalBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'virtualEthernetAdapters')
    };
  },
  function VirtualEthernetAdapter({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const virtualEthernetVios = data.get('raw_payload', []);
    const rows = virtualEthernetVios
      .keySeq()
      .toArray()
      .map(key => {
        const virtualEthernetAdapter = virtualEthernetVios.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          virtualEthernetAdapter
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <Columize>
          <Card title={t('in-phmc:dashboards.packets')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.detailed,
                metrics: [
                  'virtualEthernetAdapters.' + row.key + '.sentPackets',
                  'virtualEthernetAdapters.' + row.key + '.receivedPackets',
                  'virtualEthernetAdapters.' + row.key + '.droppedPackets'
                ],

                labels: [t('in-phmc:sentPackets'), t('in-phmc:recievedPackets'), t('in-phmc:droppedPackets')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card title={t('in-phmc:dashboards.bytes')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.perSecond.detailed,
                metrics: [
                  'virtualEthernetAdapters.' + row.key + '.sentBytes',
                  'virtualEthernetAdapters.' + row.key + '.receivedBytes',
                  'virtualEthernetAdapters.' + row.key + '.transferredBytes',
                  'virtualEthernetAdapters.' + row.key + '.transferredPhysicalBytes'
                ],
                labels: [
                  t('in-phmc:sentBytes'),
                  t('in-phmc:recievedBytes'),
                  t('in-phmc:transferredBytes'),
                  t('in-phmc:transferredPhysicalBytes')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
        </Columize>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-phmc:dashboards.virtualEthernetAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
