/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { vmId as matrixVmId, hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-components/LocationAwareTabView/TabView';
import getVsphereVm from 'in-vsphere/subscriptions/getVsphereVm';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import DashboardHeader from 'in-components/DashboardHeader';
import { vmDashboard } from 'in-vsphere/navigation/paths';
import { VmBreadcrumbs } from 'in-vsphere/breadcrumbs';
import tabs from 'in-vsphere/Dashboards/Vm/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

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
          pageRootName: t('in-vsphere:dashboards.vSphereVm')
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
      title={t('in-vsphere:dashboards.vSphereVm')}
      icon={resolveIcon(props)}
      label={get(props.result, ['data', 'label'])}
    />
  );
}

export function resolveIcon(props) {
  const guestFullName = get(props, ['result', 'data', 'guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}
