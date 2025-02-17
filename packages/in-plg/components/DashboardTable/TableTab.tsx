/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonTab, SvgIcon } from '@instana/components';

import { TableTabProps } from 'in-plg/components/DashboardTable/types';

export const TableTab = React.forwardRef<any, TableTabProps>(function TableTable(
  { label, isDisabled = false, onClick, icon }: TableTabProps,
  ref
) {
  return (
    <CarbonTab
      ref={ref}
      as={'button'}
      disabled={isDisabled}
      onClick={onClick}
      {...(icon && {
        renderIcon: () => <SvgIcon type={icon} size="xs" />
      })}
    >
      {label}
    </CarbonTab>
  );
});
