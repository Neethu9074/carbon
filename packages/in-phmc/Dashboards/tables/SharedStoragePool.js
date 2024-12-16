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
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('id');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('numOfReads');
      },
      getContent: number.perSecond.compact
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('numOfWrites');
      },
      getContent: number.perSecond.compact
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('readBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('writeBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('transmittedBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:totalSpace'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('totalSpace');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-phmc:usedSpace'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sharedStoragePool.get('usedSpace');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'sharedStoragePools')
    };
  },
  function SharedStoragePool({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const sharedStoragePoolVios = data.get('raw_payload', []);
    const rows = sharedStoragePoolVios
      .keySeq()
      .toArray()
      .map(key => {
        const sharedStoragePool = sharedStoragePoolVios.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          sharedStoragePool
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
                  'sharedStoragePools.' + row.key + '.numOfReads',
                  'sharedStoragePools.' + row.key + '.numOfReads'
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
                  'sharedStoragePools.' + row.key + '.readBytes',
                  'sharedStoragePools.' + row.key + '.writeBytes',
                  'sharedStoragePools.' + row.key + '.transmittedBytes'
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
        cardTitle={t('in-phmc:dashboards.sharedStoragePool')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
