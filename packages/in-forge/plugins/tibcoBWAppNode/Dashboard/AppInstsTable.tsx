/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { TimeConfig } from '@instana/types';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot/snapshot';
import { hasError, isLoading, success } from 'in-services/util/result';
import getTibcoBWAppInsts from '../subscriptions/getTibcoBWAppInsts';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

interface Row {
  key: string;
  timeConfig: TimeConfig;
  snapshotId: string;
}

const cols = [
  {
    title: t('in-forge:plugins.tibcoBWAppInst.name'),
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWAppInst.created'),
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
    title: t('in-forge:plugins.tibcoBWAppInst.running'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'running';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWAppInst.faulted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'faulted';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWAppInst.cancelled'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'cancelled';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWAppInst.scheduled'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'scheduled';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.tibcoBWAppInst.pagedout'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'pagedout';
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

export default function GetTibcoBWAppInsts({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id');
  const theme = useTheme();

  const appinsts = useObservable(
    getTibcoBWAppInsts({ snapshotId, timeConfig }).flatMap(result =>
      result.data
        ? combineLatest(result.data.map(appinst => getSnapshot(appinst, timeConfig))).map(appinsts => success(appinsts))
        : just(pendingResult)
    ),
    [snapshotId, timeConfig]
  ) ?? pendingResult;

  if (isLoading(appinsts)) {
    return (
      <DashboardSection title={t('in-forge:plugins.tibcoBWAppInst.appInstsWithCount', { len: 0 })}>
        <SvgIcon color={theme.ids.color.option.blue['400']} spinning type="lib_actions_loading" />
      </DashboardSection>
    );
  }

  if (hasError(appinsts)) {
    let content;
    content = <ErrorList errors={appinsts.errors} />;
    return (
      <DashboardSection title={t('in-forge:plugins.tibcoBWAppInst.appInstsWithCount', { len: 0 })}>
        {content}
      </DashboardSection>
    );
  }

  const rows =
    appinsts.data.map((appinst: SnapshotData) => ({
      key: appinst.get('id'),
      snapshot: appinst,
      timeConfig
    })) || [];

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.tibcoBWAppInst.appInstsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
    />
  );
}
