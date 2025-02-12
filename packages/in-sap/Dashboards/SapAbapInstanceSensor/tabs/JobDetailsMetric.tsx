/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { statusMap } from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/JobStatus';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
import { minutes } from 'in-services/formatters/number';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

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
        return shorten(row.jobDetails.get('JOBNAME') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobId'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('JOBCOUNT');
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobClass'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('JOBCLASS');
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('STATUS');
      }
    }
  },
  {
    title: t('in-sap:dashboards.scheduleStartDate'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('SDLSTRTDT');
      }
    }
  },
  {
    title: t('in-sap:dashboards.scheduleStartTime'),
    type: 'string',
    typeArgs: {
      getValue(row: JobDetailsRow) {
        return row.jobDetails.get('SDLSTRTTM');
      }
    }
  },
  {
    title: t('in-sap:dashboards.jobDuration'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: JobDetailsRow) {
        return row.snapshotId;
      },
      getMetricName(row: JobDetailsRow) {
        return `jobDetails.${row.key}.jobDuration`;
      },
      getContent: minutes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function JobDetailsMetrics({ snapshotId, timeConfig }: JobDetailsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'jobDetails', timeConfig),
    [snapshotId, timeConfig]
  );
  // @ts-expect-error Module needs to be translated to TS
  const [{ status }, setPhase] = useState(statusMap);
  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.status')}
      isSearchable={false}
      value={status}
      className={locals.filter}
      // @ts-expect-error Module needs to be translated to TS
      onChange={t => setPhase({ status: t ? t.value : null })}
      options={statusMap}
    />
  );

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
    })
    .filter(function (rows: JobDetailsRow) {
      if (status == null) {
        return rows;
      } else {
        return rows != null && rows.jobDetails.get('STATUS') === status;
      }
    });

  function getDetails(row: JobDetailsRow) {
    return (
      <Columize>
        <DashboardSection>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: minutes.compact,
              metrics: [`jobDetails.${row.key}.jobDuration`],
              labels: [t('in-sap:dashboards.jobDuration')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.jobsInformation')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
