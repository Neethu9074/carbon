/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import getWindowsHypervisorHost from 'in-windowshypervisor/subscriptions/getWindowsHypervisorHost';
import { HostBreadcrumbProps } from 'in-windowshypervisor/breadcrumbs/HostBreadcrumb';
// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { hostId as matrixHostId } from 'in-windowshypervisor/navigation/matrix';
import { hostDashboard } from 'in-windowshypervisor/navigation/paths';
import tabs from 'in-windowshypervisor/Dashboards/Host/tabs/index';
import { HostBreadcrumbs } from 'in-windowshypervisor/breadcrumbs';
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
        result$={getWindowsHypervisorHost({
          filter: {
            hostId: hostProps.hostId,
            timeConfig: hostProps.timeConfig
          },
          pagination: {
            page: 1,
            pageSize: 20
          },
          order: {
            by: 'name',
            direction: 'ASC'
          }
        })}
        HeaderComponent={HostDashboardHeader}
        location={location}
        tabs={tabs}
        props={hostProps}
      />

      <Footer />
    </>
  );
}

function HostDashboardHeader(props: HostBreadcrumbProps) {
  return <DashboardHeader title={t('in-windowshypervisor:host')} icon="lib_windows" label={props.result?.data?.name} />;
}
