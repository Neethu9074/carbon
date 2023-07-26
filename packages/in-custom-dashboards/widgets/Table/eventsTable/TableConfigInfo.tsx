/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { StackItem, SvgIcon } from '@instana/components';

import { TableFormConfiguration } from 'in-custom-dashboards/widgets/Table/types';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './TableConfigInfo.mless';

interface TableConfigInfoProps extends Partial<TableFormConfiguration> {}

export default function TableConfigInfo({ dynamicFocusQuery }: TableConfigInfoProps) {
  return (
    <span className={locals.tooltipLeft}>
      <Tooltip
        themeStyle="light"
        content={<TableConfigInfoTooltip dynamicFocusQuery={dynamicFocusQuery} />}
        align="bottomLeft"
        delay={500}
      >
        <SvgIcon className={locals.tableInfo} type="lib_help_error_info_outline" size="s" />
      </Tooltip>
    </span>
  );
}

function TableConfigInfoTooltip({ dynamicFocusQuery }: TableConfigInfoProps) {
  const dfqItems = dynamicFocusQuery ? dynamicFocusQuery?.split(' ') : [];
  return (
    <div className={locals.tableConfigGridContainer}>
      <StackItem>
        <div className={locals.configLabel}>{t('in-custom-dashboards:widgets.table.index.filters')}</div>
        {dfqItems.map((item, i) => {
          return (
            item.trim() && (
              <div key={i} className={locals.configValue}>
                {item}
              </div>
            )
          );
        })}
      </StackItem>
    </div>
  );
}
