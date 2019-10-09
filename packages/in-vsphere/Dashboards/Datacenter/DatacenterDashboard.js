import React, { Fragment } from 'react';
import { get } from 'lodash';

import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import { datacenter as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { datacenterDashboard } from 'in-vshpere/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { DatacenterBreadcrumb } from 'in-vsphere/breadcrumbs';
import tabs from 'in-vsphere/Dashboards/Datacenter/tabs/index';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
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
      <Breadcrumbs items={DatacenterBreadcrumb(props)} />

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
    <BasicDashboardHeader
      title="Datacenter"
      icon="lib_kubernetes_cluster"
      {...props}
      // renderActions={Actions} to be implemented
      // renderSubTypes={SubTypes} implement if needed
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}
