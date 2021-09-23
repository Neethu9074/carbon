/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HomeViewBreadcrumb from 'in-zhmc/breadcrumbs/HomeViewBreadcrumb';
import SystemBreadcrumbs from 'in-zhmc/breadcrumbs/SystemBreadcrumbs';
import ZhmcBreadcrumbs from 'in-zhmc/breadcrumbs/ZhmcBreadcrumbs';
import { getIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';

export function ZhmcBreadcrumb(props) {
  const { consoleId } = props;
  return [<HomeViewBreadcrumb />, consoleId && <ZhmcBreadcrumbs {...props} />];
}

export function SystemBreadcrumb(props) {
  const { cpcId, consoleId } = props;

  return [
    <HomeViewBreadcrumb />,
    consoleId && <ZhmcBreadcrumbs {...props} href$={getIbmzZhmcDashboard(consoleId)} />,
    cpcId && <SystemBreadcrumbs {...props} />
  ];
}
