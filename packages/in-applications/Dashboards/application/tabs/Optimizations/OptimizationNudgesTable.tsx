/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useRef } from 'react';

import { combineLatest } from '@instana/observables';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  MetricUtilisationType,
  HIGH,
  thresholdLowerLimit,
  thresholdUpperLimit
} from 'in-applications/Dashboards/application/tabs/MetricUtilisation';
//@ts-expect-error Needs TS migration
import { toggleSnapshotId } from 'in-infrastructure/tableView/stores/selectedSnapshots';
//@ts-expect-error Needs TS migration
import { data$ } from 'in-infrastructure/tableView/stores/snapshotIds';
//@ts-expect-error Needs TS migration
import createSearchSubscription from 'in-subscription/search';
//@ts-expect-error Needs TS migration
import { getTableDefinition } from 'in-sdk/snapshot';
import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-applications/Dashboards/application/tabs/Table';
import { getMetricForFocusedMoment } from 'in-stores/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-applications/Dashboards/application/tabs/OptimizationNudgesTable.mless';

const block = 'in-table-view-table';

interface TableData {
  snapshots?: Snapshot[];
  plugin?: string;
}

interface Snapshot {
  id?: string;
  get: (key: string) => string;
}

interface NudgesProps {
  applicationId: string;
  metricType: MetricUtilisationType;
  onRowCountUpdate?: (count: number) => void;
}

export default function OptimizationNudgesTable({
  applicationId,
  metricType,
  onRowCountUpdate
}: Readonly<NudgesProps>) {
  const data: TableData | null | undefined = useObservable(data$, [applicationId]);
  const plugin = 'host';
  const timeConfig = useTimeConfig();
  let applicationSnapshotIds: string[] | null | undefined = useObservable(() => {
    return createSearchSubscription({
      query: `entity.application.id:"${applicationId}"`,
      timeConfig,
      view: 'TABLE',
      restrictResultEntityType: 'com.instana.forge.infrastructure.os.host.Host'
    });
  }, [timeConfig]);

  const optimisationMetrics = useObservable(() => {
    if (applicationSnapshotIds) {
      const observableList = applicationSnapshotIds.map((snapshotId: string) =>
        getMetricForFocusedMoment({
          snapshotId: snapshotId,
          metric: 'cpu.used'
        })
      );
      return combineLatest(observableList).throttle(250);
    }
    return null;
  }, [applicationSnapshotIds]);

  const tableRef = useRef(null);
  if (!applicationSnapshotIds || !data?.snapshots || data?.plugin !== plugin || !optimisationMetrics) {
    return null;
  }

  const tableDefinition = getTableDefinition(plugin);
  const cols = tableDefinition.cols;

  if (optimisationMetrics) {
    applicationSnapshotIds = applicationSnapshotIds.filter((_: string, index: number) => {
      const metric = optimisationMetrics[index];
      if (Array.isArray(metric)) {
        if (metricType == HIGH) {
          return metric[1] >= thresholdUpperLimit;
        } else {
          return metric[1] <= thresholdLowerLimit;
        }
      }
      return false;
    });
  }

  const rows = data.snapshots
    .filter((snapshot: Snapshot) => applicationSnapshotIds?.includes(snapshot.get('id')))
    .map((snapshot: Snapshot) => {
      const snapshotId = snapshot.get('id');
      return {
        key: snapshotId,
        snapshotId,
        snapshot
      };
    });

  if (onRowCountUpdate) {
    onRowCountUpdate(rows.length);
  }

  return (
    <div className={block}>
      {rows.length !== 0 && (
        <>
          <div className={locals.nudgeTableTitle}>
            <Typography variant="heading-300" noMargin>
              {metricType == HIGH
                ? t('in-applications:titleResourceOverutilization', {
                    thresholdUpperLimit: percentageZeroDecimalPlaces(thresholdUpperLimit)
                  })
                : t('in-applications:titleResourceUnderutilization', {
                    thresholdLowerLimit: percentageZeroDecimalPlaces(thresholdLowerLimit)
                  })}
            </Typography>
          </div>
          <Table
            ref={tableRef}
            key={plugin}
            cols={cols}
            rows={rows}
            initialSortColumn={tableDefinition.initialSortColumn}
            initialSortDirection={tableDefinition.initialSortDirection}
            onRowClick={(row: { key: any; snapshot: { get: (arg0: string) => any } }) =>
              toggleSnapshotId(row.key, row.snapshot ? row.snapshot.get('plugin') : null)
            }
            maxItemsPerPage={5}
          />
        </>
      )}
    </div>
  );
}
