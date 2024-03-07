/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import { isEqual } from 'lodash';
import React from 'react';

import { KeyValue, Stack } from '@instana/components';
import { SvgIcon } from '@instana/components';

import { LogGroupLabel } from 'in-alerting/smart-alerts/logs/components/LogGroupLabel';
import { number, withSiPrefixOneDecimalPlace } from 'in-services/formatters/number';
import AggregationSymbol from 'in-components/AggregationSymbol/AggregationSymbol';
import { CatalogResponse } from 'in-logging/api/catalog';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Group, LogGroupItem } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/aggregated/components/GroupTableList.mless';

export function getColumnDefinition({
  groupBy,
  selectedMetricGroup,
  tagCatalog
}: {
  groupBy: Group[];
  selectedMetricGroup?: string;
  tagCatalog?: CatalogResponse;
}) {
  const iconColumn = {
    width: '4rem',
    id: 'icon',
    getId: () => 'icon',
    widthInAbsoluteUnit: true,
    sortable: false,
    verticallyCenter: true,
    getContent(item: LogGroupItem) {
      const displayIcon = isEqual(item.label, selectedMetricGroup);
      return (
        <div className={locals.icon}>
          <SvgIcon
            type="lib_check"
            className={classNames({
              [locals.hideIcon]: !displayIcon
            })}
          />
        </div>
      );
    }
  };

  const groupsColumn = groupBy.map((groups: Group) => {
    return {
      width: '6rem',
      getId: (item: LogGroupItem) => (item ? item.label : ''),
      id: groups.groupbyTag,
      cellClassName: locals.wordBreak,
      headCellProps: {
        className: locals.wordBreak
      },
      sortable: false,
      label: <LogGroupLabel groups={[groups]} tagCatalog={tagCatalog} />,
      getContent(item: LogGroupItem) {
        return item.label;
      }
    };
  });

  const countLabelColumnTable = groupBy.map(() => {
    return {
      id: 'numberOfLogs',
      width: '8rem',
      label: t('in-alerting:smartAlerts.logs.logs'),
      widthInAbsoluteUnit: true,
      sortable: false,
      getContent(item: LogGroupItem) {
        const { numberOfLogs } = item;
        const formattedNumber = number.forcedCompact.compact(numberOfLogs);

        const Value = (
          <Stack align="center" gap="xxsmall" direction="horizontal">
            <AggregationSymbol aggregation="SUM" />
            <Tooltip content={formattedNumber} align="mousePosition">
              <span>{withSiPrefixOneDecimalPlace(numberOfLogs)}</span>
            </Tooltip>
          </Stack>
        );

        return <KeyValue value={Value} accentuated />;
      }
    };
  });

  return [iconColumn, ...groupsColumn, ...countLabelColumnTable];
}
