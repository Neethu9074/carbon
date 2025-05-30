/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import getLinuxKVMHypervisorHost from 'in-linuxkvmhypervisor/subscriptions/getLinuxKVMHypervisorHost';
import { HostBreadcrumbProps } from 'in-linuxkvmhypervisor/breadcrumbs/HostBreadcrumb';
// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { hostId as matrixHostId } from 'in-linuxkvmhypervisor/navigation/matrix';
import { hostDashboard } from 'in-linuxkvmhypervisor/navigation/paths';
import tabs from 'in-linuxkvmhypervisor/Dashboards/Host/tabs/index';
import { HostBreadcrumbs } from 'in-linuxkvmhypervisor/breadcrumbs';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

interface HostDashboardProps {
  location: Location;
}
export default function HostDashboard({ location }: HostDashboardProps) {
  const hostProps: HostBreadcrumbProps = {
    hostId: getMatrixParameter(location, hostDashboard, matrixHostId),
    viewPath: hostDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <>
      <Breadcrumbs items={HostBreadcrumbs(hostProps)} />
      <TabView
        result$={getLinuxKVMHypervisorHost({
          filter: {
            hostId: hostProps.hostId,
            timeConfig: hostProps.timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={hostProps}
      />

      <Footer />
    </>
  );
}

function Header(props: HostBreadcrumbProps) {
  return <DashboardHeader title={t('in-linuxkvmhypervisor:host')} icon="lib_linux" label={props.result?.data?.name} />;
}
