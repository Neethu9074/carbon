/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { TimeConfig } from '@instana/types';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import getTibcoBWProcesses from '../subscriptions/getTibcoBWProcesses';
import { hasError, isLoading, success } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface Row {
  key: string;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.tibcoBWProcess.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWProcess.created'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'created';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWProcess.suspended'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'suspended';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWProcess.failed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'failed';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWProcess.completed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'completed';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWAppNode.health'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      }
    }
  }
];

export default function GetTibcoBWProcesses({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id');

  const processes =
    useObservable(
      getTibcoBWProcesses({ snapshotId, timeConfig }).flatMap(result =>
        result.data
          ? combineLatest(result.data.map(process => getSnapshot(process, timeConfig))).map(processes =>
              success(processes)
            )
          : just(pendingResult)
      ),
      [snapshotId, timeConfig]
    ) ?? pendingResult;

  if (isLoading(processes)) {
    return (
      <DashboardSection title={t('in-forge:plugins.tibcoBWProcess.processesWithCount', { len: 0 })}>
        <SvgIcon color={themes.default.ids.color.option.blue['400']} spinning type="lib_actions_loading" />
      </DashboardSection>
    );
  }

  if (hasError(processes)) {
    let content;
    content = <ErrorList errors={processes.errors} />;
    return (
      <DashboardSection title={t('in-forge:plugins.tibcoBWProcess.processesWithCount', { len: 0 })}>
        {content}
      </DashboardSection>
    );
  }

  const rows =
    processes.data.map((process: SnapshotData) => ({
      key: process.get('id'),
      snapshot: process,
      timeConfig
    })) || [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tibcoBWProcess.processesWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
