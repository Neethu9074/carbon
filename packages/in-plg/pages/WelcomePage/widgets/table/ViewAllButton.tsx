/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardTableRow as Row, DashboardTableCell as Cell, DashboardButton } from '@instana/components';

import locals from './ViewAllButton.mless';

interface ViewAllButtonProps {
  href?: string;
  viewLabel: string;
  isTableEmpty?: boolean;
  columnCount: number;
}

export default function ViewAllButton({
  columnCount,
  href,
  viewLabel,
  isTableEmpty = false
}: Readonly<ViewAllButtonProps>) {
  return (
    <Row className="viewAllTableRow">
      <Cell className="viewAllTableCell" colSpan={columnCount}>
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
      </Cell>
    </Row>
  );
}
