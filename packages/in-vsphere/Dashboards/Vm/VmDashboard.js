/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { get } from 'lodash';

import { vmId as matrixVmId, hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import EntityVersionList from 'in-new-components/EntityVersionList';
import getVsphereVm from 'in-vsphere/subscriptions/getVsphereVm';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { vmDashboard } from 'in-vsphere/navigation/paths';
import { VmBreadcrumbs } from 'in-vsphere/breadcrumbs';
import tabs from 'in-vsphere/Dashboards/Vm/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function VMDashboard({ location }) {
  const props = {
    datacenterId: getMatrixParameter(location, vmDashboard, matrixDatacenterId),
    hostId: getMatrixParameter(location, vmDashboard, matrixHostId),
    vmId: getMatrixParameter(location, vmDashboard, matrixVmId),
    viewPath: vmDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={VmBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'vSphere',
          pageRootName: 'vSphere VM'
        }}
      />

      <TabView
        result$={getVsphereVm({
          filter: {
            vmId: props.vmId,
            timeConfig: props.timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.vsphereVM}
              snapshotId={props.vmId}
              timeConfig={props.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />

      <Footer />
    </Fragment>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title="vSphere VM"
      icon={resolveIcon(props)}
      label={get(props.result, ['data', 'label'])}
    />
  );
}

export function resolveIcon(props) {
  const guestFullName = get(props, ['result', 'data', 'guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}
