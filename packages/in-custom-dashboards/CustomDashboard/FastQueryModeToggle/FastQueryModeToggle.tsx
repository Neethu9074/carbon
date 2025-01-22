/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer, Toggle, Tooltip } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error needs TS migration
import { fastQueryModeEnabledParameter } from 'in-custom-dashboards/navigation/url';
import useUrlState from 'in-hooks/useUrlState';

import locals from 'in-custom-dashboards/CustomDashboard/FastQueryModeToggle/FastQueryModeToggle.mless';

interface FastQueryModeToggleProps {
  tooltipContent?: string;
}

// TODO: Consolidate this and in-applications/.../FastQueryModeToggle and move to in-components.
export const FastQueryModeToggle = ({ tooltipContent }: FastQueryModeToggleProps) => {
  const [{ fastQueryModeEnabled }, onChange] = useUrlState({
    bind: [fastQueryModeEnabledParameter],
    replaceHistory: false
  });
  const onChangeFastQueryModeEnabled = (fastQueryModeEnabled: boolean) => {
    onChange({ fastQueryModeEnabled });
  };
  return (
    <div className={locals.preview}>
      <Tooltip content={tooltipContent ?? t('in-applications:analyze.fastQueryModeTooltip')} delay={500}>
        <span>{t('in-applications:analyze.fastQueryMode')}</span>
      </Tooltip>
      <Spacer horizontal="xsmall" />
      <Toggle checked={fastQueryModeEnabled} onToggle={onChangeFastQueryModeEnabled} />
    </div>
  );
};
