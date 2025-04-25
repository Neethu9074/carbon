/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import { isEqual } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';

//@ts-expect-error
import { getMetricColumns } from 'in-infrastructure/Explore/components/InfrastructureList';
import { InfrastructureExploreItem, Result, TimeConfig } from 'in-types';
import { Metadatas } from 'in-infrastructure/hooks/useMetricMetadatas';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroupTableList.mless';

interface ColumnDefinitionProps {
  metrics: object[];
  sortable?: boolean;
  metricMetadatas: Result<Metadatas>;
  timeConfig: TimeConfig;
  granularity: number;
  selectedSnapshotId?: string;
  isWidget?: boolean;
}

export function getColumnDefinition({
  metrics,
  sortable,
  metricMetadatas,
  timeConfig,
  granularity,
  selectedSnapshotId,
  isWidget = false
}: ColumnDefinitionProps) {
  const iconColumn = {
    width: '2rem',
    id: 'icon',
    getId: () => 'icon',
    widthInAbsoluteUnit: true,
    sortable: false,
    verticallyCenter: true,
    getContent(item: InfrastructureExploreItem) {
      const displayIcon = isEqual(item.snapshotId, selectedSnapshotId);
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

  const labelColumn = {
    id: 'label',
    label: t('in-infrastructure:explore.name'),
    sortable: true,
    getContent(item: InfrastructureExploreItem) {
      return item.label;
    }
  };

  const metricsColumn = getMetricColumns({ metrics, sortable, metricMetadatas, timeConfig, granularity, isWidget });

  return [iconColumn, labelColumn, ...metricsColumn];
}
