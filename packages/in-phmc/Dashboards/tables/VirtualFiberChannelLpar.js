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
    title: t('in-phmc:wwpn'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('wwpn');
      }
    }
  },
  {
    title: t('in-phmc:wwpn2'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('wwpn2');
      }
    }
  },
  {
    title: t('in-phmc:physicalPortWWPN'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('physicalPortWWPN');
      }
    }
  },
  {
    title: t('in-phmc:viosId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('viosId');
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('numOfReads');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('numOfWrites');
      },
      getContent: number.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('readBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('writeBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('transmittedBytes');
      },
      getContent: bytes.perSecond.detailed
    }
  },
  {
    title: t('in-phmc:runningSpeed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.virtualFiberChannelAdapter.get('runningSpeed');
      },
      getContent: number.detailed
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'virtualFiberChannelAdapters')
    };
  },

  function VirtualFiberChannelLpar({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const virtualFiber = data.get('raw_payload', []);
    const rows = virtualFiber
      .keySeq()
      .toArray()
      .map(key => {
        const virtualFiberChannelAdapter = virtualFiber.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          virtualFiberChannelAdapter
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <Columize>
          <Card title={t('in-phmc:dashboards.noOfReadWrite')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: [
                  'virtualFiberChannelAdapters.' + row.key + '.numOfReads',
                  'virtualFiberChannelAdapters.' + row.key + '.numOfWrites'
                ],
                labels: [t('in-phmc:reads'), t('in-phmc:writes')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </Card>
          <Card title={t('in-phmc:dashboards.noOfByte')} useMaxAvailableHeight>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: [
                  'virtualFiberChannelAdapters.' + row.key + '.readBytes',
                  'virtualFiberChannelAdapters.' + row.key + '.writeBytes',
                  'virtualFiberChannelAdapters.' + row.key + '.transmittedBytes'
                ],
                labels: [t('in-phmc:readBytes'), t('in-phmc:writeBytes'), t('in-phmc:transmittedBytes')],
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
        cardTitle={t('in-phmc:dashboards.virtualFiberChannelAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
