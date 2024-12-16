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
    title: t('in-phmc:id'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:sentPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('sentPackets');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:recievedPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('receivedPackets');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:droppedPackets'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('droppedPackets');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:sentBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('sentBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:recievedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('receivedBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:transferredBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericAdapter.get('transferredBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'genericAdapters')
    };
  },
  function GenericAdapter({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const genericVios = data.get('raw_payload', []);
    const rows = genericVios
      .keySeq()
      .toArray()
      .map(key => {
        const genericAdapter = genericVios.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          genericAdapter
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
                  'genericAdapters.' + row.key + '.sentPackets',
                  'genericAdapters.' + row.key + '.receivedPackets',
                  'genericAdapters.' + row.key + '.droppedPackets'
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
                  'genericAdapters.' + row.key + '.sentBytes',
                  'genericAdapters.' + row.key + '.receivedBytes',
                  'genericAdapters.' + row.key + '.transferredBytes'
                ],
                labels: [t('in-phmc:sentBytes'), t('in-phmc:recievedBytes'), t('in-phmc:transferredBytes')],
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
        cardTitle={t('in-phmc:dashboards.genericAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
