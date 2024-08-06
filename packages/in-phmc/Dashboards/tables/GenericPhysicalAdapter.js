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
        return row.genericPhysicalAdapter.get('id');
      }
    }
  },
  {
    title: t('in-phmc:type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('type');
      }
    }
  },
  {
    title: t('in-phmc:physicalLocation'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('physicalLocation');
      }
    }
  },
  {
    title: t('in-phmc:reads'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('numOfReads');
      },
      getContent: number.perSecond.compact
    }
  },
  {
    title: t('in-phmc:writes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('numOfWrites');
      },
      getContent: number.perSecond.compact
    }
  },
  {
    title: t('in-phmc:readBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('readBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:writeBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('writeBytes');
      },
      getContent: bytes.perSecond.compact
    }
  },
  {
    title: t('in-phmc:transmittedBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.genericPhysicalAdapter.get('transmittedBytes');
      },
      getContent: bytes.perSecond.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'genericPhysicalAdapters')
    };
  },
  function GenericPhysicalAdapter({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const genericPhysicalVios = data.get('raw_payload', []);
    const rows = genericPhysicalVios
      .keySeq()
      .toArray()
      .map(key => {
        const genericPhysicalAdapter = genericPhysicalVios.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          genericPhysicalAdapter
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
                  'genericPhysicalAdapters.' + row.key + '.numOfReads',
                  'genericPhysicalAdapters.' + row.key + '.numOfWrites'
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
                  'genericPhysicalAdapters.' + row.key + '.readBytes',
                  'genericPhysicalAdapters.' + row.key + '.writeBytes',
                  'genericPhysicalAdapters.' + row.key + '.transmittedBytes'
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
        cardTitle={t('in-phmc:dashboards.genericPhysicalAdapter')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
