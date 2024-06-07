/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number, minutes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

interface JobDetailsRow {
  key: string;
  snapshotId: string;
  jobDetails: Map<string, object>;
}

interface JobDetailsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.jobName'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('JOBNAME');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobId'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('JOBCOUNT');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobClass'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('JOBCLASS');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('STATUS');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.scheduleStartDate'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('SDLSTRTDT');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.scheduleStartTime'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('SDLSTRTTM');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.prdHours'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: JobDetailsRow) {
        return row.snapshotId;
      },
      getMetricName(row: JobDetailsRow) {
        return `jobDetails.${row.key}.PRDHOURS`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.prdMins'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: JobDetailsRow) {
        return row.snapshotId;
      },
      getMetricName(row: JobDetailsRow) {
        return `jobDetails.${row.key}.PRDMINS`;
      },
      getContent: minutes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function JobDetailsMetrics({ snapshotId, timeConfig }: JobDetailsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'jobDetails'), [snapshotId]);
  if (!data) {
    return null;
  }
  const jobList = (data as SnapshotData).get('raw_payload', []);
  const rows: JobDetailsRow[] = jobList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const jobDetails = jobList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        jobDetails
      };
    });

  function getDetails(row: JobDetailsRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`jobDetails.${row.key}.PRDHOURS`],
            labels: [t('in-sap:dashboards.prdHours')],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: minutes.detailed,
            metrics: [`jobDetails.${row.key}.PRDMINS`],
            labels: [t('in-sap:dashboards.prdMins')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.jobsInformation')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}

function Args({ args }: { args: any }) {
  return <code className={locals.statement}>{args}</code>;
}
