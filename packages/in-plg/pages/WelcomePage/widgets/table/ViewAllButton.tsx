/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardButton } from '@instana/components';

import locals from './ViewAllButton.mless';

interface ViewAllButtonProps {
  href?: string;
  viewLabel: string;
  isTableEmpty?: boolean;
}

export default function ViewAllButton({ href, viewLabel, isTableEmpty = false }: Readonly<ViewAllButtonProps>) {
  return (
    <DashboardButton
      size="md"
      kind="ghost"
      iconSize="s"
      icon="lib_arrow_right"
      iconStyle={locals.viewAllButtonArrowIcon}
      href={href}
      ariaLabel={viewLabel}
      iconDescription={viewLabel}
      disabled={isTableEmpty}
    >
      {viewLabel}
    </DashboardButton>
  );
}
