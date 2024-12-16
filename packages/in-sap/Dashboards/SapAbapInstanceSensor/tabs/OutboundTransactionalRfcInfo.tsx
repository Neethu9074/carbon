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
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface TRfcOutboundRow {
  key: string;
  snapshotId: string;
  rfcStats: Map<string, object>;
}

interface TRfcOutboundProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.destinations'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCDEST') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCUSER') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.wpPID'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCPID') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.tCode'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCTCODE') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.rfcState'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCSTATE') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.functionModule'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCFNAM') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.counter'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: TRfcOutboundRow) {
        return row.snapshotId;
      },
      getMetricName(row: TRfcOutboundRow) {
        return `outboundTRfcInfo.${row.key}.ARFCLUWCNT`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.message'),
    type: 'string',
    typeArgs: {
      getValue(row: TRfcOutboundRow) {
        return shorten(row.rfcStats.get('ARFCMSG') as any, 64);
      }
    }
  }
];
export default function OutboundTransactionalRfcInfo({ snapshotId, timeConfig }: TRfcOutboundProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'outboundTRfcInfo'), [snapshotId]);
  const tRfcList = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: TRfcOutboundRow[] = tRfcList
    ? tRfcList
        .keySeq()
        .toArray()
        .map((key: string) => {
          const rfcStats = tRfcList.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            rfcStats
          };
        })
    : [];

  function getDetails(row: TRfcOutboundRow) {
    return (
      <Columize>
        <DashboardSection>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`outboundTRfcInfo.${row.key}.ARFCLUWCNT`],
              labels: [t('in-sap:dashboards.counter')],
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
      cardTitle={t('in-sap:dashboards.outboundTransactionalRfcInfo')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
