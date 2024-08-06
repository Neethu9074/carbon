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
        return row.fiberChannelAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:wwpn'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('wwpn');
      }
    }
  },
  {
    title: t('in-phmc:ports'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('numOfPorts');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('numOfReads');
      },
      getContent: number.perSecond.compact
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('numOfWrites');
      },
      getContent: number.perSecond.compact
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('readBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('writeBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('transmittedBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:runningSpeed'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.fiberChannelAdapter.get('runningSpeed');
      },
      getContent: number.compact
    }
  }
];
export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'fiberChannelAdapters')
    };
  },
  function FiberChannel({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const fiberChannelVios = data.get('raw_payload', []);
    const rows = fiberChannelVios
      .keySeq()
      .toArray()
      .map(key => {
        const fiberChannelAdapter = fiberChannelVios.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          fiberChannelAdapter
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
                  'fiberChannelAdapters.' + row.key + '.numOfReads',
                  'fiberChannelAdapters.' + row.key + '.numOfWrites'
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
                formatter: bytes.perSecond.compact,
                metrics: [
                  'fiberChannelAdapters.' + row.key + '.readBytes',
                  'fiberChannelAdapters.' + row.key + '.writeBytes',
                  'fiberChannelAdapters.' + row.key + '.transmittedBytes'
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
        cardTitle={t('in-phmc:dashboards.fiberChannelAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
