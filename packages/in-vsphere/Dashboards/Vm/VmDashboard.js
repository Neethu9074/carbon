import React, { Fragment } from 'react';
import { get } from 'lodash';

import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { vmId as matrixVmId } from 'in-vsphere/navigation/matrix';
import getVsphereVm from 'in-vsphere/subscriptions/getVsphereVm';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { DatacenterBreadcrumbs } from 'in-vsphere/breadcrumbs';
import { vmDashboard } from 'in-vsphere/navigation/paths';
import tabs from 'in-vsphere/Dashboards/Vm/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function VMDashboard({ location }) {
  const props = {
    vmId: getMatrixParameter(location, vmDashboard, matrixVmId),
    viewPath: vmDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={DatacenterBreadcrumbs(props)} />

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
              plugin={plugins.vsphereVm}
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
    <BasicDashboardHeader
      title="VM"
      icon={resolveIcon(props)}
      {...props}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}

export function resolveIcon(props) {
  const guestFullName = get(props, ['result', 'data', 'guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}
