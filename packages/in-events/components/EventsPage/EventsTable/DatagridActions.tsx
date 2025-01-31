/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonIconButton, CarbonTableToolbarContent, SvgIcon } from '@instana/components';
import { DataGridState, useFilterContext } from '@instana/ibm-products';

import locals from './EventsTable.mless';

export const DatagridActions = (datagridState: DataGridState) => {
  const { setPanelOpen } = useFilterContext();
  const label = datagridState.filterProps?.panelIconDescription || '';
  return (
    <>
      <CarbonTableToolbarContent className={locals.toolbarContent}>
        <CarbonIconButton label={label} kind="ghost" onClick={() => setPanelOpen((open: boolean) => !open)}>
          <SvgIcon type="lib_actions_filter" size={'xs'} />
        </CarbonIconButton>
      </CarbonTableToolbarContent>
    </>
  );
};
