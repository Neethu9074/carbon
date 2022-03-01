/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

// import { HypervisorBreadcrumbs } from 'in-openstack/breadcrumbs';
import EntityVersionList from 'in-components/EntityVersionList';
// import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
// import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import getOpenstackInstance from 'in-openstack/subscriptions/getOpenstackInstance';
import { instanceId as matrixInstanceId } from 'in-openstack/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { regionId as matrixRegionId } from 'in-openstack/navigation/matrix';
import { instanceDashboard } from 'in-openstack/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-openstack/Dashboards/Instances/tabs/index';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function InstanceDashboard({ location }) {
  const props = {
    regionId: getMatrixParameter(location, instanceDashboard, matrixRegionId),
    instanceId: getMatrixParameter(location, instanceDashboard, matrixInstanceId),
    viewPath: instanceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      {/* <Breadcrumbs items={HypervisorBreadcrumbs(props)} /> */}
      <ViewTrackingMeta
        data={{
          productArea: 'openstack',
          pageRootName: t('in-openstack:dashboards.computeInstances')
        }}
      />

      <TabView
        result$={getOpenstackInstance({
          filter: {
            regionId: props.regionId,
            hypervisorId: props.hypervisorId,
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
              // plugin={plugins.vsphereHost}
              snapshotId={props.hypervisorId}
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
      title={t('in-openstack:dashboards.hypervisors')}
      label={get(props.result, ['data', 'label'])}
    />
  );
}
