/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SharedProcessorPoolBreadcrumb from 'in-phmc/breadcrumbs/SharedProcessorPoolBreadcrumb';
import { getIbmpPhmcDashboard, getIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import HomeViewBreadcrumb from 'in-phmc/breadcrumbs/HomeViewBreadcrumb';
import SystemBreadcrumb from 'in-phmc/breadcrumbs/SystemBreadcrumb';
import PhmcBreadcrumb from 'in-phmc/breadcrumbs/PhmcBreadcrumb';
import ViosBreadcrumb from 'in-phmc/breadcrumbs/ViosBreadcrumb';
import LparBreadcrumb from 'in-phmc/breadcrumbs/LparBreadcrumb';

export function PhmcBreadcrumbs(props) {
  const { consoleId } = props;
  return [<HomeViewBreadcrumb />, consoleId && <PhmcBreadcrumb {...props} />];
}

export function SystemBreadcrumbs(props) {
  const { systemId, consoleId } = props;
  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumb {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumb {...props} />
  ];
}

export function ViosBreadcrumbs(props) {
  const { viosId, systemId, consoleId } = props;
  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumb {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumb {...props} href$={getIbmpSystemDashboard(systemId, { consoleId })} />,
    viosId && <ViosBreadcrumb {...props} />
  ];
}
export function LparBreadcrumbs(props) {
  const { lparId, systemId, consoleId } = props;
  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumb {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumb {...props} href$={getIbmpSystemDashboard(systemId, { consoleId })} />,
    lparId && <LparBreadcrumb {...props} />
  ];
}
export function SharedProcessorPoolBreadcrumbs(props) {
  const { sharedProcessorPoolId, systemId, consoleId } = props;
  return [
    <HomeViewBreadcrumb />,
    consoleId && <PhmcBreadcrumb {...props} href$={getIbmpPhmcDashboard(consoleId)} />,
    systemId && <SystemBreadcrumb {...props} href$={getIbmpSystemDashboard(systemId, { consoleId })} />,
    sharedProcessorPoolId && <SharedProcessorPoolBreadcrumb {...props} />
  ];
}
