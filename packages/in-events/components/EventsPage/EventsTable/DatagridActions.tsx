/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { IconButton, TableToolbarContent } from '@carbon/react';
import { DataGridState } from '@carbon/ibm-products/lib/components/Datagrid/types';
import { useFilterContext } from '@carbon/ibm-products';
import { Filter } from '@carbon/react/icons';
import React from 'react';

import locals from './EventsTable.mless';

export const DatagridActions = (datagridState: DataGridState) => {
  const { setPanelOpen } = useFilterContext();
  const label = datagridState.filterProps?.panelIconDescription || '';
  return (
    <>
      <TableToolbarContent className={locals.toolbarContent}>
        <IconButton label={label} kind="ghost" onClick={() => setPanelOpen((open: boolean) => !open)}>
          <Filter />
        </IconButton>
      </TableToolbarContent>
    </>
  );
};
