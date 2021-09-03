/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Map } from 'immutable';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

//@ts-ignore
import { KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { LogGroupItem, TagFilterExpression, TimeConfig } from 'in-types';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { isLoading, hasError } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { LOG_LEVEL } from 'in-logging/queryBuilder';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface LogsKpiCardProps {
  hasLogs: boolean | undefined;
  tagFilterExpression: TagFilterExpression;
  timeConfig: TimeConfig;
  snapshot: Map<string, any>;
}

interface LogsWithDataKpiCardProps extends LogsKpiCardProps {
  title: string;
}

export default function LogsKpiCard(props: LogsKpiCardProps) {
  const { hasLogs } = props;

  const title = t('in-forge:plugins.docker.dashboard.logs');
  let value = null;
  if (hasLogs === true) {
    return <LogsWithDataKpiCard title={title} {...props} />;
  } else if (hasLogs === false) {
    value = valueMissingPlaceholder;
  } else if (hasLogs === undefined) {
    value = <SvgIcon color={theme.lib.colors.lightBlue800} spinning type="lib_actions_loading" />;
  }

  return <KpiKeyValue label={title}>{value}</KpiKeyValue>;
}

function LogsWithDataKpiCard({ title, tagFilterExpression, timeConfig, snapshot }: LogsWithDataKpiCardProps) {
  const logGroupsResult =
    useObservable(
      () =>
        getLogGroups({
          timeConfig,
          group: { groupbyTag: LOG_LEVEL, groupbyTagEntity: 'NOT_APPLICABLE' },
          tagFilterExpression,
          pagination: {
            retrievalSize: 20
          }
        }),
      [timeConfig.to, timeConfig.windowSize]
    ) || pendingResult;

  if (isLoading(logGroupsResult)) {
    return (
      <KpiKeyValue label={title}>
        <SvgIcon color={theme.lib.colors.lightBlue800} spinning type="lib_actions_loading" />
      </KpiKeyValue>
    );
  }
  if (hasError(logGroupsResult)) {
    return <KpiKeyValue label={title}>{valueMissingPlaceholder}</KpiKeyValue>;
  }

  const numberWarnLogs = getLogsOfType(logGroupsResult.data.items, 'WARN');
  const numberErrorLogs = getLogsOfType(logGroupsResult.data.items, 'ERROR');

  return (
    <KpiKeyValue
      label={title}
      iconAction={{
        text: t('in-forge:plugins.docker.dashboard.analyzeLogs'),
        kind: 'subtle',
        icon: 'lib_analyze',
        href$: getLinkToAnalyze({ timeConfig, tagFilterExpression: [tagFilterExpression] }),
        onClick: () =>
          jumpToLogs({
            source: 'analyze logs from infra dashboard',
            plugin: snapshot.get('plugin'),
            snapshotId: snapshot.get('id')
          })
      }}
    >
      <span>
        {t('in-forge:plugins.docker.dashboard.numberLogs', {
          numberErrorLogs: number.compact(numberErrorLogs),
          numberWarnLogs: number.compact(numberWarnLogs)
        })}
      </span>
    </KpiKeyValue>
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
