import React, { Fragment } from 'react';
import { get } from 'lodash';

import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { datacenterDashboard } from 'in-vsphere/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
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
      title="Cluster"
      icon="lib_kubernetes_cluster"
      {...props}
      // renderActions={Actions} to be implemented
      // renderSubTypes={SubTypes} implement if needed
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}
