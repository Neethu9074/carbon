/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getIbmpPhmcDashboard, getIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import HomeViewBreadcrumb from 'in-phmc/breadcrumbs/HomeViewBreadcrumb';
import SystemBreadcrumbs from 'in-phmc/breadcrumbs/SystemBreadcrumbs';
import PhmcBreadcrumbs from 'in-phmc/breadcrumbs/PhmcBreadcrumbs';
import ViosBreadcrumbs from 'in-phmc/breadcrumbs/ViosBreadcrumbs';
import LparBreadcrumbs from 'in-phmc/breadcrumbs/LparBreadcrumbs';

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
export function ViosBreadcrumb(props) {
  const { viosId, systemId, consoleId } = props;
  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumbs {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumbs {...props} href$={getIbmpSystemDashboard(systemId, { consoleId })} />,
    viosId && <ViosBreadcrumbs {...props} />
  ];
}
export function LparBreadcrumb(props) {
  const { lparId, systemId, consoleId } = props;
  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumbs {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumbs {...props} href$={getIbmpSystemDashboard(systemId, { consoleId })} />,
    lparId && <LparBreadcrumbs {...props} />
  ];
}
