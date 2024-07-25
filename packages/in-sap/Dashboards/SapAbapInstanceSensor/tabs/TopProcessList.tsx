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
import TopProcessUserNameList from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/TopProcessUsernameList';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { kiloBytes, seconds, number } from 'in-services/formatters/number';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/ComboBox.mless';

interface TopProcessStatsRow {
  key: string;
  snapshotId: string;
  topProcessStats: Map<string, object>;
}

interface TopProcessStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
  props: any;
}

const cols = [
  {
    title: t('in-sap:dashboards.serialNumber'),
    type: 'number',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('slNo');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.procId'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('procId');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('userName');
      }
    }
  },
  {
    title: t('in-sap:dashboards.command'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('command');
      }
    }
  },
  {
    title: t('in-sap:dashboards.cpuTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TopProcessStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: TopProcessStatsRow) {
        return `topProcessMetricStats.${row.key}.cpuTime`;
      },
      getContent: seconds.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.resSize'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TopProcessStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: TopProcessStatsRow) {
        return `topProcessMetricStats.${row.key}.resSize`;
      },
      getContent: kiloBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.priority'),
    type: 'string',
    typeArgs: {
      getValue(row: TopProcessStatsRow) {
        return row.topProcessStats.get('priority');
      }
    }
  }
];

export default function TopProcessList({ snapshotId, timeConfig, props }: TopProcessStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'topProcessMetricStats'), [snapshotId]);
  const topProcessNameList = TopProcessUserNameList(props).sort((a, b) => {
    return a.label.localeCompare(b.label);
  });
  topProcessNameList.push({
    value: 'Other',
    label: t('in-sap:dashboards.other')
  });

  const listWithoutOther = topProcessNameList.filter(item => item.label != 'other');
  // @ts-expect-error Module needs to be translated to TS
  const [{ userName }, setUsername] = useState(topProcessNameList);

  const rightHeader = (
    <ComboBox
      placeholder={t('in-sap:dashboards.userName')}
      isSearchable={false}
      value={userName}
      className={locals.filter}
      // @ts-expect-error Module needs to be translated to TS
      onChange={t => setUsername({ userName: t ? t.value : null })}
      options={topProcessNameList}
    />
  );

  if (!data) {
    return null;
  }
  const topProcessStat = (data as SnapshotData).get('raw_payload', []);

  const rows: TopProcessStatsRow[] = topProcessStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const topProcessStats = topProcessStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        topProcessStats
      };
    })
    .filter(function (rows: TopProcessStatsRow) {
      if (userName == null) {
        return rows;
      } else if (userName == 'Other') {
        const userName = rows?.topProcessStats.get('userName');
        return (
          rows != null && typeof userName === 'string' && !listWithoutOther.some(item => userName === item['value'])
        );
      } else {
        return rows != null && rows.topProcessStats.get('userName') === userName;
      }
    });

  function getDetails(row: TopProcessStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`topProcessMetricStats.${row.key}.cpuTime`],
                labels: [t('in-sap:dashboards.cpuTime')],
                type: 'line',
                formatter: seconds.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`topProcessMetricStats.${row.key}.resSize`],
                labels: [t('in-sap:dashboards.resSize')],
                type: 'line',
                formatter: kiloBytes.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.TopProcessList')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
      rightHeader={rightHeader}
    />
  );
}
