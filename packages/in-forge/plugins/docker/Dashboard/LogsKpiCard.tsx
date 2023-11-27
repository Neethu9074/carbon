/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Map } from 'immutable';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { LOG_LEVEL, getValueMatchTagFilter, DOCKER_ID } from 'in-logging/queryBuilder';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { isLoading, hasError } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { LogGroupItem, TimeConfig } from 'in-types';
import { useTheme } from 'in-themes';
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

export default function LogsKpiCard(props: LogsKpiCardProps) {
  const { timeConfig, hasLogs, snapshot } = props;

  const tagFilterExpression = [
    getValueMatchTagFilter({
      name: DOCKER_ID,
      value: snapshot.get('data')?.get('Id')
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
        href$: getLinkToAnalyze({ timeConfig, tagFilterExpression }),
        onClick: () =>
          jumpToLogs({
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
  const theme = useTheme();
  return <SvgIcon color={theme.ids.color.option.blue['400']} spinning type="lib_actions_loading" />;
}

function Value({ timeConfig, snapshot }: ValueProps) {
  const title = t('in-forge:plugins.docker.dashboard.logs');
  const theme = useTheme();

  const getLogsTagFilterExpression = getValueMatchTagFilter({
    name: DOCKER_ID,
    value: snapshot.get('data')?.get('Id')
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
    return (
      <KpiKeyValue label={title}>
        <SvgIcon color={theme.ids.color.option.blue['400']} spinning type="lib_actions_loading" />
      </KpiKeyValue>
    );
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
