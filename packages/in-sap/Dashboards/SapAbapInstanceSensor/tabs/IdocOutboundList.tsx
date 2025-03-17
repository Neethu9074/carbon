/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface IdocOutboundDetailsRow {
  key: string;
  snapshotId: string;
  outBoundDetails: Map<string, object>;
}

interface IdocOutBoundDetailsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.msgType'),
    type: 'string',
    typeArgs: {
      getValue(row: IdocOutboundDetailsRow) {
        return row.outBoundDetails.get('msgType');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.success'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: IdocOutboundDetailsRow) {
        return row.snapshotId;
      },
      getMetricName(row: IdocOutboundDetailsRow) {
        return `outboundDetails.${row.key}.successCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.readyToProcess'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: IdocOutboundDetailsRow) {
        return row.snapshotId;
      },
      getMetricName(row: IdocOutboundDetailsRow) {
        return `outboundDetails.${row.key}.readyToProcessCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.error'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: IdocOutboundDetailsRow) {
        return row.snapshotId;
      },
      getMetricName(row: IdocOutboundDetailsRow) {
        return `outboundDetails.${row.key}.errorCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function IdocOutboundMetrics({ snapshotId, timeConfig }: IdocOutBoundDetailsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'outboundDetails', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return (
      <DashboardNotification type="info">
        {t('in-sap:dashboards.noDataFound')}: {t('in-sap:dashboards.outBoundIdoc')}
      </DashboardNotification>
    );
  }
  const outBoundList = (data as SnapshotData).get('raw_payload', []);
  const rows: IdocOutboundDetailsRow[] = outBoundList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const outBoundDetails = outBoundList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        outBoundDetails
      };
    });

  function getDetails(row: IdocOutboundDetailsRow) {
    return (
      <div>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [
              `outboundDetails.${row.key}.successCount`,
              `outboundDetails.${row.key}.readyToProcessCount`,
              `outboundDetails.${row.key}.errorCount`
            ],
            labels: [
              t('in-sap:dashboards.success'),
              t('in-sap:dashboards.readyToProcess'),
              t('in-sap:dashboards.error')
            ],
            type: 'line',
            // @ts-expect-error Module needs to be translated to TS
            colors: [
              themes.default.ids.color.option.green['800'],
              themes.default.ids.color.option.blue['500'],
              themes.default.ids.color.option.red['700']
            ]
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.outBoundIdoc')}
      cols={cols}
      rows={rows}
      initialSortDirection="desc"
      initialSortColumn={3}
      getRowDetails={getDetails}
    />
  );
}

function Args({ args }: { args: any }) {
  return <code>{args}</code>;
}
