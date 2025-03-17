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
import { bytes, number, seconds } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface RFCCallsRow {
  key: string;
  snapshotId: string;
  rfcDetails: Map<string, object>;
}

interface RFCCallsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: RFCCallsRow) {
        return row.rfcDetails.get('client');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: RFCCallsRow) {
        return row.rfcDetails.get('account');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.entryID'),
    type: 'string',
    typeArgs: {
      getValue(row: RFCCallsRow) {
        return row.rfcDetails.get('entryID');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.localDestination'),
    type: 'string',
    typeArgs: {
      getValue(row: RFCCallsRow) {
        return row.rfcDetails.get('localDest');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.remoteDestination'),
    type: 'string',
    typeArgs: {
      getValue(row: RFCCallsRow) {
        return row.rfcDetails.get('remoteDest');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.rfcSource'),
    type: 'string',
    typeArgs: {
      getValue(row: RFCCallsRow) {
        return row.rfcDetails.get('target');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.calls'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RFCCallsRow) {
        return row.snapshotId;
      },
      getMetricName(row: RFCCallsRow) {
        return `rfcCalls.${row.key}.calls`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RFCCalls({ snapshotId, timeConfig }: RFCCallsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'rfcCalls', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }

  const rfcList = (data as SnapshotData).get('raw_payload', []);
  const rows: RFCCallsProps[] = rfcList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const rfcDetails = rfcList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        rfcDetails
      };
    })
    .filter((row: RFCCallsRow) => {
      const userValue = row.rfcDetails.get('account');
      return typeof userValue === 'string' && userValue !== 'UNKNOWN';
    });

  function getDetails(row: RFCCallsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`rfcCalls.${row.key}.call_Time`, `rfcCalls.${row.key}.execution_Time`],
                labels: [t('in-sap:dashboards.callTime'), t('in-sap:dashboards.executionTime')],
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
                metrics: [`rfcCalls.${row.key}.sendData`, `rfcCalls.${row.key}.receiveData`],
                labels: [t('in-sap:dashboards.sentData'), t('in-sap:dashboards.receivedData')],
                type: 'line',
                formatter: bytes.detailed
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
      cardTitle={t('in-sap:dashboards.rfcStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}

function Args({ args }: { args: any }) {
  return <code>{args}</code>;
}
