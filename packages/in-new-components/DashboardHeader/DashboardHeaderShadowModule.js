/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';

import locals from './DashboardHeaderShadowModule.mless';

export default function DashboardHeaderShadowModule() {
  return <DashboardHeaderModule className={locals.shadowModule} withBottomBorder={false} />;
}
