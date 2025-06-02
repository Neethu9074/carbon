/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { HostBreadcrumbProps } from 'in-xenserver/breadcrumbs/HostBreadcrumb';
import getXenServerHost from 'in-xenserver/subscriptions/getXenServerHost';
import { hostId as matrixHostId } from 'in-xenserver/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { hostDashboard } from 'in-xenserver/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import tabs from 'in-xenserver/Dashboards/Host/tabs/index';
import { HostBreadcrumbs } from 'in-xenserver/breadcrumbs';
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
        result$={getXenServerHost({
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
    <DashboardHeader title={t('in-xenserver:host')} icon="lib_xenserver" label={get(props.result, ['data', 'name'])} />
  );
}
