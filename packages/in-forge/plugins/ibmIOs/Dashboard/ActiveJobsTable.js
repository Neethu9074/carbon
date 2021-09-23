/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number, percentage, bytes } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const JobTypeEnum = jobType => {
  switch (jobType) {
    case 1:
      return 'ASJ';
    case 2:
      return 'BCH';
    case 3:
      return 'BCI';
    case 4:
      return 'EVK';
    case 5:
      return 'INT';
    case 6:
      return 'M36';
    case 7:
      return 'MRT';
    case 8:
      return 'PDJ';
    case 9:
      return 'PJ';
    case 10:
      return 'RDR';
    case 11:
      return 'SBS';
    case 12:
      return 'SYS';
    case 13:
      return 'WTR';
    default:
      return '-';
  }
};

const JobStatusEnum = jobStatus => {
  switch (jobStatus) {
    case 1:
      return 'BSCA';
    case 2:
      return 'BSCW';
    case 3:
      return 'CMNA';
    case 4:
      return 'CMNW';
    case 5:
      return 'CMTW';
    case 6:
      return 'CNDW';
    case 7:
      return 'CPCW';
    case 8:
      return 'DEQA';
    case 9:
      return 'DEQW';
    case 10:
      return 'DKTA';
    case 11:
      return 'DKTW';
    case 12:
      return 'DLYW';
    case 13:
      return 'DSC';
    case 14:
      return 'DSPA';
    case 15:
      return 'DSPW';
    case 16:
      return 'END';
    case 17:
      return 'EOFA';
    case 18:
      return 'EOFW';
    case 19:
      return 'EOJ';
    case 20:
      return 'EVTW';
    case 21:
      return 'GRP';
    case 22:
      return 'HLD';
    case 23:
      return 'HLDT';
    case 24:
      return 'ICFA';
    case 25:
      return 'ICFW';
    case 26:
      return 'INEL';
    case 27:
      return 'JVAA';
    case 28:
      return 'JVAW';
    case 29:
      return 'LCKW';
    case 30:
      return 'LSPA';
    case 31:
      return 'LSPW';
    case 32:
      return 'MLTA';
    case 33:
      return 'MLTW';
    case 34:
      return 'MSGW';
    case 35:
      return 'MTXW';
    case 36:
      return 'MXDW';
    case 37:
      return 'OPTA';
    case 38:
      return 'OPTW';
    case 39:
      return 'OSIW';
    case 40:
      return 'PRTA';
    case 41:
      return 'PRTW';
    case 42:
      return 'PSRW';
    case 43:
      return 'RUN';
    case 44:
      return 'SELW';
    case 45:
      return 'SEMW';
    case 46:
      return 'SIGS';
    case 47:
      return 'SIGW';
    case 48:
      return 'SRQ';
    case 49:
      return 'SVFA';
    case 50:
      return 'SVFW';
    case 51:
      return 'TAPA';
    case 52:
      return 'TAPW';
    case 53:
      return 'THDW';
    case 54:
      return 'TIMA';
    case 55:
      return 'TIMW';
    default:
      return '-';
  }
};

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.jobName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.activeJobInfoStringData.get('jobName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.activeJobInfoStringData.get('authorizationName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.elapsedCPU'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `activeJobsMetrics.${row.key}.elapsedCPU`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.temporaryStorage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `activeJobsMetrics.${row.key}.temporaryStorage`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.jobStatus'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `activeJobsMetrics.${row.key}.jobStatus`;
      },
      getContent: JobStatusEnum,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.jobType'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `activeJobsMetrics.${row.key}.jobType`;
      },
      getContent: JobTypeEnum,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'activeJobInfoMap')
    };
  },
  function activeJobsTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const activeJobInfoMap = data.get('raw_payload');
    if (activeJobInfoMap.size === 0) {
      return null;
    }

    const rows = activeJobInfoMap
      .map((activeJobInfoStringData, key) => {
        return {
          key,
          activeJobInfoStringData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.name')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
        getRowDetails={getRowDetails}
      />
    );
  }
);

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  const timeConfig = row.timeConfig;

  return (
    <div>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: percentage.detailed,
          metrics: ['activeJobsMetrics.' + row.key + '.elapsedCPU'],
          labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.elapsedCPU')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: bytes.detailed,
          metrics: ['activeJobsMetrics.' + row.key + '.temporaryStorage'],
          labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.temporaryStorage')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          formatter: number.compact,
          metrics: ['activeJobsMetrics.' + row.key + '.threadCount'],
          labels: [t('in-forge:plugins.ibmIOs.dashboard.tables.activeJobs.charts.threadCount')],
          min: 0,
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
