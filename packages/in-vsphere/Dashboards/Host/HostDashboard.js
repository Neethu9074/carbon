import React, { Fragment } from 'react';
import { get } from 'lodash';

import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import { hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import getVsphereHost from 'in-vsphere/subscriptions/getVsphereHost';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import EntityVersionList from 'in-new-components/EntityVersionList';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { DatacenterBreadcrumbs } from 'in-vsphere/breadcrumbs';
import { hostDashboard } from 'in-vsphere/navigation/paths';
import tabs from 'in-vsphere/Dashboards/Host/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-new-components/Footer';
import { plugins } from 'in-forge/constants';

export default function DatacenterDashboard({ location }) {
  const props = {
    hostId: getMatrixParameter(location, hostDashboard, matrixHostId),
    viewPath: hostDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={DatacenterBreadcrumbs(props)} />

      <TabView
        result$={getVsphereHost({
          filter: {
            hostId: props.hostId,
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
              plugin={plugins.vsphereHost}
              snapshotId={props.hostId}
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
      title="Host"
      icon="lib_linux"
      {...props}
      getLabel={result => get(result, ['data', 'label'])}
    />
  );
}
