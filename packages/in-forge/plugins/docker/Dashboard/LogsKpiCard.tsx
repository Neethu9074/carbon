/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Map } from 'immutable';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { LOG_LEVEL, getValueMatchTagFilter, DOCKER_ID, CONTAINERD_ID } from 'in-logging/queryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import {
  ANALYZE_LOGGING_JUMP_TO_LOGS,
} from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { isLoading, hasError } from 'in-services/util/result';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { LogGroupItem, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface LogsKpiCardProps {
  hasLogs: boolean | undefined;
  timeConfig: TimeConfig;
  snapshot: Map<string, any>;
}

interface ValueProps {
  timeConfig: TimeConfig;
  snapshot: Map<string, any>;
}

const PLUGIN_IDS: Record<string, string> = {
  docker: DOCKER_ID,
  containerd: CONTAINERD_ID
} as const;

export default function LogsKpiCard(props: LogsKpiCardProps) {
  const { timeConfig, hasLogs, snapshot } = props;
  const {trackCta} = useSegmentTracking()
  const snapshotId = snapshot.get('data')?.get('Id') || snapshot.get('data')?.get('id');

  const tagFilterExpression: FormModelElement[] = [
    getValueMatchTagFilter({
      name: PLUGIN_IDS[snapshot.get('plugin')],
      value: snapshotId
    }),
    {
      type: 'CONJUNCTION',
      logicalOperator: 'AND'
    },
    {
      type: 'OPEN_BRACKET'
    },
    getValueMatchTagFilter({
      name: LOG_LEVEL,
      value: 'WARN'
    }),
    {
      type: 'CONJUNCTION',
      logicalOperator: 'OR'
    },
    getValueMatchTagFilter({
      name: LOG_LEVEL,
      value: 'ERROR'
    }),
    {
      type: 'CLOSE_BRACKET'
    }
  ];

  const logsHref = useLinkToLogs({ timeConfig, tagFilterExpression });

  const title = t('in-forge:plugins.docker.dashboard.logs');
  let value = null;
  if (hasLogs === true) {
    value = <Value {...props} />;
  } else if (hasLogs === false) {
    value = <ValueNoData />;
  } else if (hasLogs === undefined) {
    value = <ValueLoading />;
  }

  return (
    <KpiKeyValue
      label={title}
      iconAction={{
        text: t('in-forge:plugins.docker.dashboard.analyzeLogs'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href: logsHref,
        onClick: () =>
          trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS,{
            source: 'analyze logs from infra dashboard',
            plugin: snapshot.get('plugin'),
            snapshotId: snapshot.get('id')
          })
      }}
    >
      {value}
    </KpiKeyValue>
  );
}

function ValueNoData() {
  return <>{valueMissingPlaceholder}</>;
}

function ValueLoading() {
  return <SvgIcon color={themes.default.ids.color.option.blue['400']} spinning type="lib_actions_loading" />;
}

function Value({ timeConfig, snapshot }: ValueProps) {
  const title = t('in-forge:plugins.docker.dashboard.logs');

  const snapshotId = snapshot.get('data')?.get('Id') || snapshot.get('data')?.get('id');

  const getLogsTagFilterExpression = getValueMatchTagFilter({
    name: PLUGIN_IDS[snapshot.get('plugin')],
    value: snapshotId
  });

  const logGroupsResult =
    useObservable(
      () =>
        getLogGroups({
          timeConfig,
          group: { groupbyTag: LOG_LEVEL, groupbyTagEntity: 'NOT_APPLICABLE' },
          tagFilterExpression: getLogsTagFilterExpression,
          pagination: {
            retrievalSize: 20
          }
        }),
      [timeConfig.to, timeConfig.windowSize]
    ) || pendingResult;

  if (isLoading(logGroupsResult)) {
    return <SvgIcon color={themes.default.ids.color.option.blue['400']} spinning type="lib_actions_loading" />;
  }
  if (hasError(logGroupsResult)) {
    return <KpiKeyValue label={title}>{valueMissingPlaceholder}</KpiKeyValue>;
  }

  const numberWarnLogs = getLogsOfType(logGroupsResult.data.items, 'WARN');
  const numberErrorLogs = getLogsOfType(logGroupsResult.data.items, 'ERROR');

  return (
    <span>
      {t('in-forge:plugins.docker.dashboard.numberLogs', {
        numberErrorLogs: number.compact(numberErrorLogs),
        numberWarnLogs: number.compact(numberWarnLogs)
      })}
    </span>
  );
}

function getLogsOfType(logGroups: LogGroupItem[], type: string): number {
  for (const logGroup of logGroups) {
    if (logGroup.label === type) {
      return logGroup.numberOfLogs;
    }
  }
  return 0;
}
