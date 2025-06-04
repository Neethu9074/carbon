/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import { hostId as matrixHostId, vmId as matrixVMId } from 'in-windowshypervisor/navigation/matrix';
import getWindowsHypervisorVM from 'in-windowshypervisor/subscriptions/getWindowsHypervisorVM';
// @ts-expect-error
import EntityVersionList from 'in-components/EntityVersionList';
// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { VMBreadcrumbProps } from 'in-windowshypervisor/breadcrumbs/VMBreadcrumb';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { vmDashboard } from 'in-windowshypervisor/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-windowshypervisor/Dashboards/VM/tabs/index';
import { VMBreadcrumbs } from 'in-windowshypervisor/breadcrumbs';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

interface VMDashboardProps {
  location: Location;
}
export default function VMDashboard({ location }: VMDashboardProps) {
  const vmProps: VMBreadcrumbProps = {
    hostId: getMatrixParameter(location, vmDashboard, matrixHostId),
    vmId: getMatrixParameter(location, vmDashboard, matrixVMId),
    snapshotId: getMatrixParameter(location, vmDashboard, matrixHostId),
    viewPath: vmDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <>
      <Breadcrumbs items={VMBreadcrumbs(vmProps)} />
      <TabView
        result$={getWindowsHypervisorVM({
          filter: {
            vmId: vmProps.vmId,
            hostId: vmProps.hostId,
            timeConfig: vmProps.timeConfig
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
        props={vmProps}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.windowsHypervisorVM}
              snapshotId={vmProps.snapshotId}
              timeConfig={vmProps.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />
      <Footer />
    </>
  );
}

function Header(props: VMBreadcrumbProps) {
  return (
    <DashboardHeader
      title={t('in-windowshypervisor:vm')}
      icon="lib_windows"
      label={get(props.result, ['data', 'name'])}
    />
  );
}
