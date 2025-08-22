/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Filter } from '@carbon/icons-react';
import React from 'react';

import { TableToolbar, TableToolbarContent, IconButton, TableToolbarSearch } from '@instana/carbon';

export default function Dependency() {
  return (
    <TableToolbar>
      <TableToolbarContent>
        <IconButton label="Filter" kind="ghost" align="right">
          <Filter />
        </IconButton>

        <TableToolbarSearch placeholder="Search" size="sm" />
      </TableToolbarContent>
    </TableToolbar>
  );
}
