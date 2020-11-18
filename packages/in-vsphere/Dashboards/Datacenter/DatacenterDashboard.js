import React, { Fragment } from 'react';
import { get } from 'lodash';

import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { datacenterDashboard } from 'in-vsphere/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import tabs from 'in-vsphere/Dashboards/Datacenter/tabs/index';
import { DatacenterBreadcrumbs } from 'in-vsphere/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function DatacenterDashboard({ location }) {
  const props = {
    datacenterId: getMatrixParameter(location, datacenterDashboard, matrixDatacenterId),
    viewPath: datacenterDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={DatacenterBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'vSphere',
          pageRootName: 'vSphere Datacenter'
        }}
      />

      <TabView
        result$={getVsphereDatacenter({
          filter: {
            datacenterId: props.datacenterId,
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
              plugin={plugins.vsphereDatacenter}
              snapshotId={props.datacenterId}
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
      title="vSphere Datacenter"
      icon="lib_vsphere_datacenter"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
