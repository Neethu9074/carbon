/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import getLinuxKVMHypervisorVM from 'in-linux-kvm-hypervisor/subscriptions/getLinuxKVMHypervisorVM';
import { VMBreadcrumbProps } from 'in-linux-kvm-hypervisor/breadcrumbs/VMBreadcrumb';
// @ts-expect-error
import EntityVersionList from 'in-components/EntityVersionList';
// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { hostId as matrixHostId } from 'in-linux-kvm-hypervisor/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { vmId as matrixVMId } from 'in-linux-kvm-hypervisor/navigation/matrix';
import { vmDashboard } from 'in-linux-kvm-hypervisor/navigation/paths';
import tabs from 'in-linux-kvm-hypervisor/Dashboards/VM/tabs/index';
import { VMBreadcrumbs } from 'in-linux-kvm-hypervisor/breadcrumbs';
import { productAreas } from 'in-services/tracking/productAreas';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
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
    viewPath: vmDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <>
      <Breadcrumbs items={VMBreadcrumbs(vmProps)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.linuxkvmhypervisor,
          pageRootName: pageNames.linuxkvmhypervisor_vm
        }}
      />
      <TabView
        result$={getLinuxKVMHypervisorVM({
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
              plugin={plugins.linuxKVMHypervisorVM}
              snapshotId={vmProps.vmId}
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
      title={t('in-linux-kvm-hypervisor:vm')}
      icon="lib_linux"
      label={get(props.result, ['data', 'name'])}
    />
  );
}
