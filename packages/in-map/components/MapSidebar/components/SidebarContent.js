/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Jail from 'in-components/Jail';

import locals from './SidebarContent.mless';

export default function SidebarContent({ snapshot, ForgeDetailsComponent }) {
  return (
    <div className={locals.sidebarContent}>
      <Jail component={ForgeDetailsComponent} props={{ snapshot }} />
    </div>
  );
}
