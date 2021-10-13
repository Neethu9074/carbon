/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import HomeViewBreadcrumb from 'in-phmc/breadcrumbs/HomeViewBreadcrumb';
import SystemBreadcrumbs from 'in-phmc/breadcrumbs/SystemBreadcrumbs';
import PhmcBreadcrumbs from 'in-phmc/breadcrumbs/PhmcBreadcrumbs';

export function PhmcBreadcrumb(props) {
  const { consoleId } = props;
  return [<HomeViewBreadcrumb />, consoleId && <PhmcBreadcrumbs {...props} />];
}

export function SystemBreadcrumb(props) {
  const { systemId, consoleId } = props;

  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumbs {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumbs {...props} />
  ];
}

