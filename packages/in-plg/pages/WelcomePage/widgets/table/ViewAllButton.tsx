/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { DashboardTableRow as Row, DashboardTableCell as Cell, Link } from '@instana/components';

interface ViewAllButtonProps {
  href?: string;
  viewLabel: string;
  isTableEmpty?: boolean;
}

export default function ViewAllButton({ href, viewLabel, isTableEmpty = false }: ViewAllButtonProps) {
  return (
    <Row className="viewAllTableRow">
      <Cell className="viewAllTableCell">
        {isTableEmpty && (
          <Link
            style={{ color: 'var(--cds-text-on-color-disabled)' }}
            href={href}
            linkIconType="lib_arrow_right"
            disabled={isTableEmpty}
          >
            {viewLabel}
          </Link>
        )}
        {!isTableEmpty && (
          <Link href={href} linkIconType="lib_arrow_right" disabled={isTableEmpty}>
            {viewLabel}
          </Link>
        )}
      </Cell>
    </Row>
  );
}
