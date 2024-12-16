/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { IconButton, TableToolbarContent } from '@carbon/react';
import { Filter } from '@carbon/react/icons';
import React from 'react';

import { useFilterContext } from '@instana/ibm-products';

import locals from './EventsTable.mless';

export const DatagridActions = datagridState => {
  const { filterProps } = datagridState;
  const { setPanelOpen } = useFilterContext();

  return (
    <>
      <TableToolbarContent className={locals.toolbarContent}>
        <IconButton label={filterProps.panelIconDescription} kind="ghost" onClick={() => setPanelOpen(open => !open)}>
          <Filter />
        </IconButton>
      </TableToolbarContent>
    </>
  );
};
