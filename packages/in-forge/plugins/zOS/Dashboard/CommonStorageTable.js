/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zOS.commonStorage.job'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Common_Storage_Utilization_History.${row.key}.percentage_csa_in_use`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.commonStorage.percentageSqaInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Common_Storage_Utilization_History.${row.key}.percentage_sqa_in_use`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.commonStorage.amountCsaInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Common_Storage_Utilization_History.${row.key}.amount_csa_in_use`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.commonStorage.amountSqaInUse'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Common_Storage_Utilization_History.${row.key}.amount_sqa_in_use`;
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'CommonStorageRawData', props.timeConfig)
    };
  },
  function CommonStorageTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const commonStorageJobs = data.get('raw_payload');
    if (commonStorageJobs.size === 0) {
      return null;
    }

    const rows = commonStorageJobs
      .map((commonStorageJob, key) => {
        return {
          key,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zOS.commonStorage.title')}
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
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'Common_Storage_Utilization_History.' + row.key + '.percentage_csa_in_use',
            'Common_Storage_Utilization_History.' + row.key + '.percentage_ecsa_in_use',
            'Common_Storage_Utilization_History.' + row.key + '.percentage_sqa_in_use',
            'Common_Storage_Utilization_History.' + row.key + '.percentage_esqa_in_use'
          ],
          labels: [
            t('in-forge:plugins.zOS.commonStorage.percentageCsaInUse'),
            t('in-forge:plugins.zOS.commonStorage.percentageEcsaInUse'),
            t('in-forge:plugins.zOS.commonStorage.percentageSqaInUse'),
            t('in-forge:plugins.zOS.commonStorage.percentageEsqaInUse')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'Common_Storage_Utilization_History.' + row.key + '.amount_csa_in_use',
            'Common_Storage_Utilization_History.' + row.key + '.amount_ecsa_in_use',
            'Common_Storage_Utilization_History.' + row.key + '.amount_sqa_in_use',
            'Common_Storage_Utilization_History.' + row.key + '.amount_esqa_in_use'
          ],
          labels: [
            t('in-forge:plugins.zOS.commonStorage.amountCsaInUse'),
            t('in-forge:plugins.zOS.commonStorage.amountEcsaInUse'),
            t('in-forge:plugins.zOS.commonStorage.amountSqaInUse'),
            t('in-forge:plugins.zOS.commonStorage.amountEsqaInUse')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
