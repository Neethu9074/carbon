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
import { hasError, isLoading, success } from 'in-services/util/result';
import getHostWinServices from '../subscriptions/getHostWinServices';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface Row {
  key: string;
  timeConfig: TimeConfig;
  snapshot: SnapshotData;
}

type ServiceStatus = Record<number, string>;
const StatusMap: ServiceStatus = {
  1: 'STOPPED',
  2: 'STARTING',
  3: 'STOPPING',
  4: 'RUNNING',
  5: 'CONTINUING',
  6: 'PAUSING',
  7: 'PAUSED'
};
function getServiceStatus(v: number) {
  return StatusMap[v];
}

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.servicename'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'servicename']);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.displayname'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'displayname']);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.state'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      },
      getMetricName() {
        return 'state';
      },
      getContent: getServiceStatus,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.pid'),
    type: 'string',
    typeArgs: {
      getValue(row: Row) {
        return row.snapshot.getIn(['data', 'pid']);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.health'),
    type: 'health',
    typeArgs: {
      getSnapshotId(row: Row) {
        return row.key;
      }
    }
  }
];

export default function GetHostWinServices({ snapshot }: { snapshot: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = snapshot.get('id');

  const winsvcs =
    useObservable(
      getHostWinServices({ snapshotId, timeConfig }).flatMap(result =>
        result.data
          ? combineLatest(result.data.map(winsvc => getSnapshot(winsvc, timeConfig))).map(winsvcs => success(winsvcs))
          : just(pendingResult)
      ),
      [snapshotId, timeConfig]
    ) ?? pendingResult;

  if (isLoading(winsvcs)) {
    return (
      <DashboardSection title={t('in-forge:plugins.host.dashboard.services')}>
        <SvgIcon color={themes.default.ids.color.option.blue['400']} spinning type="lib_actions_loading" />
      </DashboardSection>
    );
  }

  if (hasError(winsvcs)) {
    let content;
    content = <ErrorList errors={winsvcs.errors} />;
    return <DashboardSection title={t('in-forge:plugins.host.dashboard.services')}>{content}</DashboardSection>;
  }

  const rows =
    winsvcs.data.map((winsvc: SnapshotData) => ({
      key: winsvc.get('id'),
      snapshot: winsvc,
      timeConfig
    })) || [];

  if (rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={t('in-forge:plugins.host.dashboard.services')} cols={cols} rows={rows} />;
}
