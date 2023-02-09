/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, percentagePlainZeroDecimalPlaces, micros } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zIms.addressSpaces.job'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.addressSpaces.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.addressSpacesJob.get('type');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.addressSpaces.swappedOut'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.addressSpacesJob.get('swapped_out');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.addressSpaces.cpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `address_spaces.${row.key}.cpu_time`;
      },
      getContent: micros.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.addressSpaces.workingSetSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `address_spaces.${row.key}.working_set_size`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'AddressSpacesRawData', props.timeConfig)
    };
  },
  function AddressSpacesTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const addressSpacesJobs = data.get('raw_payload');
    if (addressSpacesJobs.size === 0) {
      return null;
    }

    const rows = addressSpacesJobs
      .map((addressSpacesJob, key) => {
        return {
          key,
          addressSpacesJob,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zIms.addressSpaces.title')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['address_spaces.' + row.key + '.cpu_percentage'],
            labels: [t('in-forge:plugins.zIms.addressSpaces.cpuPercentage')],
            type: 'line',
            formatter: percentagePlainZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['address_spaces.' + row.key + '.excp_rate'],
            labels: [t('in-forge:plugins.zIms.addressSpaces.excpRate')],
            type: 'line',
            formatter: number.short
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'address_spaces.' + row.key + '.common_page_in_rate',
            'address_spaces.' + row.key + '.private_page_in_rate'
          ],
          labels: [
            t('in-forge:plugins.zIms.addressSpaces.commonPageInRate'),
            t('in-forge:plugins.zIms.addressSpaces.privatePageInRate')
          ],
          type: 'line',
          formatter: number.short
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
