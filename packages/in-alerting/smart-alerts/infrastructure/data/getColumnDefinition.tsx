/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import { isEqual } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';

//@ts-expect-error
import { getGroupTagValue, getMetricsColumn } from 'in-infrastructure/Explore/components/GroupedInfrastructure';
import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { GroupLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraGroupLabel';
//@ts-expect-error
import { getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { InfrastructureGroup, Result, TagCatalog, TimeConfig } from 'in-types';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupTableList.mless';

interface ColumnDefinitionProps {
  groupBy: string[];
  isTableMode: boolean;
  metrics: object[];
  type: string;
  metricMetadatas: Result<Metadatas>;
  timeConfig: TimeConfig;
  granularity: number;
  selectedMetricGroup: Tags | null;
  tagCatalog?: TagCatalog;
}

export function getColumnDefinition({
  groupBy,
  isTableMode,
  metrics,
  type,
  metricMetadatas,
  timeConfig,
  granularity,
  selectedMetricGroup,
  tagCatalog
}: ColumnDefinitionProps) {
  const snapshotDefinition = getOptionalSnapshotDefinition(type);
  const countLabel = snapshotDefinition ? getPluginName(type, 2) : t('in-alerting:smartAlerts.infrastructure.count');

  const iconColumn = {
    width: '2rem',
    id: 'icon',
    getId: () => 'icon',
    widthInAbsoluteUnit: true,
    sortable: false,
    verticallyCenter: true,
    getContent(item: InfrastructureGroup) {
      const displayIcon = isEqual(item.tags, selectedMetricGroup);
      return (
        <SvgIcon
          type="lib_check"
          className={classNames({
            [locals.hideIcon]: !displayIcon
          })}
        />
      );
    }
  };

  const groupsColumn = groupBy.map((groupKey: string) => {
    return {
      width: getColumnWidth(groupBy, metrics),
      getId: () => groupKey,
      id: groupKey,
      cellClassName: locals.wordBreak,
      headCellProps: {
        className: locals.wordBreak
      },
      ...{
        sortable: true,
        label: groupKey && tagCatalog ? <GroupLabel groupKey={groupKey} tagCatalog={tagCatalog} /> : null,
        getContent(item: InfrastructureGroup) {
          return getGroupTagValue(item, groupKey);
        }
      }
    };
  });

  const countLabelColumnTable = {
    width: '4rem',
    id: countLabel,
    getId: () => countLabel,
    label: countLabel,
    sortable: false,
    getContent(item: InfrastructureGroup) {
      return item?.count;
    }
  };

  const metricsColumn = getMetricsColumn({ metrics, metricMetadatas, timeConfig, granularity, isTableMode });

  return [iconColumn, ...groupsColumn, countLabelColumnTable, ...metricsColumn];
}

/**
 * Returns the column width for the infrastructure table.
 * @param groupBy The group by fields.
 * @param metrics The metrics.
 * @returns The column width.
 */
function getColumnWidth(groupBy: string[], metrics: object[]): string {
  const totalMetrics = 5;
  return Math.max(1, (totalMetrics - metrics.length) / groupBy.length) * 10 + 'rem';
}
