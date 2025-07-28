/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import getLinuxKVMHypervisorHost from 'in-linux-kvm-hypervisor/subscriptions/getLinuxKVMHypervisorHost';
import { HostBreadcrumbProps } from 'in-linux-kvm-hypervisor/breadcrumbs/HostBreadcrumb';
// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { hostId as matrixHostId } from 'in-linux-kvm-hypervisor/navigation/matrix';
import { hostDashboard } from 'in-linux-kvm-hypervisor/navigation/paths';
import tabs from 'in-linux-kvm-hypervisor/Dashboards/Host/tabs/index';
import { HostBreadcrumbs } from 'in-linux-kvm-hypervisor/breadcrumbs';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
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
      <ViewTrackingMeta
        data={{
          productArea: productAreas.linuxkvmhypervisor,
          pageRootName: pageNames.linuxkvmhypervisor_host
        }}
      />
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
  return (
    <DashboardHeader
      title={t('in-linux-kvm-hypervisor:host')}
      icon="lib_linux_kvm_hypervisor"
      label={get(props.result, ['data', 'name'])}
    />
  );
}
