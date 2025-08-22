/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Filter } from '@carbon/icons-react';
import React, { useState } from 'react';

import { TableToolbar, TableToolbarContent, IconButton, TableToolbarSearch } from '@instana/carbon';

import { t } from 'in-i18n';

export default function Dependency() {
  const [filterPopOpen, setFilterPopOpen] = useState(false);
  const [onSearch, setOnSearch] = useState(false);
  return (
    <TableToolbar>
      <TableToolbarContent>
        <IconButton label="Filter" kind="ghost" align="right" onClick={setFilterPopOpen}>
          <Filter />
        </IconButton>

        <TableToolbarSearch placeholder="Search" onChange={setOnSearch} size="sm" />
      </TableToolbarContent>
    </TableToolbar>
  );
}
