/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { StackItem, SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './TableConfigInfo.mless';

interface TableConfigInfoProps {
  dynamicFocusQuery?: string;
  topLevelFilterNote?: string;
}

export default function TableConfigInfo({ dynamicFocusQuery, topLevelFilterNote }: TableConfigInfoProps) {
  if (!dynamicFocusQuery) {
    return null;
  }
  return (
    <span className={locals.tooltipLeft} title="">
      <Tooltip
        themeStyle="light"
        content={
          <TableConfigInfoTooltip dynamicFocusQuery={dynamicFocusQuery} topLevelFilterNote={topLevelFilterNote} />
        }
        align="auto"
        delay={500}
        forceTheme
        legacy
      >
        <SvgIcon type="lib_help_error_info_outline" size="s" />
      </Tooltip>
    </span>
  );
}

function TableConfigInfoTooltip({ dynamicFocusQuery, topLevelFilterNote }: TableConfigInfoProps) {
  const dfqItems = dynamicFocusQuery ? dynamicFocusQuery?.split(' ') : [];
  return (
    <div className={locals.tableConfigGridContainer} title="">
      <StackItem>
        <div className={locals.configLabel}>{topLevelFilterNote}</div>
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
