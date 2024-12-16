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
// @ts-expect-error needs TS migration
import { formatSql } from 'in-forge/tracing/jdbc/sql';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import Code from 'in-components/Code/Code';
import { t } from 'in-i18n';

interface UpdateErrorRow {
  key: string;
  snapshotId: string;
  updateErrorStats: Map<string, object>;
}

interface UpdateErrorProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.moduleID'),
    type: 'string',
    typeArgs: {
      getValue(row: UpdateErrorRow) {
        return row.updateErrorStats.get('moduleID');
      }
    }
  },
  {
    title: t('in-sap:dashboards.function'),
    type: 'string',
    typeArgs: {
      getValue(row: UpdateErrorRow) {
        return row.updateErrorStats.get('function');
      }
    }
  },
  {
    title: t('in-sap:dashboards.report'),
    type: 'string',
    typeArgs: {
      getValue(row: UpdateErrorRow) {
        return row.updateErrorStats.get('report');
      }
    }
  },
  {
    title: t('in-sap:dashboards.line'),
    type: 'string',
    typeArgs: {
      getValue(row: UpdateErrorRow) {
        return row.updateErrorStats.get('line');
      }
    }
  },
  {
    title: t('in-sap:dashboards.applicationArea'),
    type: 'string',
    typeArgs: {
      getValue(row: UpdateErrorRow) {
        return row.updateErrorStats.get('applicationArea');
      }
    }
  },
  {
    title: t('in-sap:dashboards.messageNumber'),
    type: 'string',
    typeArgs: {
      getValue(row: UpdateErrorRow) {
        return row.updateErrorStats.get('messageNumber');
      }
    }
  }
];

export default function UpdateError({ snapshotId, timeConfig }: UpdateErrorProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'updateErrorStats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const updateErrorStat = (data as SnapshotData).get('raw_payload', []);
  const rows: UpdateErrorRow[] = updateErrorStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const updateErrorStats = updateErrorStat.get(key);

      return {
        key,
        snapshotId,
        timeConfig,
        updateErrorStats
      };
    });

  function getDetails(row: UpdateErrorRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`updateErrorStats.${row.key}.noVariableMsgPart`],
                labels: [t('in-sap:dashboards.noVariableMsgPart')],
                type: 'line',
                formatter: number.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <label>Variable message part : </label>
            <Code
              code={formatSql(
                row.updateErrorStats.get('variableMsgPart') == null ? '' : row.updateErrorStats.get('variableMsgPart')
              )}
              lang="bash"
              softWrap
            />
            <label>Key : </label>
            <Code
              code={formatSql(row.updateErrorStats.get('key') == null ? '' : row.updateErrorStats.get('key'))}
              lang="sql"
              softWrap
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.updateError')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
