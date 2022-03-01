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
import getOpenstackHypervisor from 'in-openstack/subscriptions/getOpenstackHypervisor';
import { hypervisorId as matrixHypervisorId } from 'in-openstack/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { regionId as matrixRegionId } from 'in-openstack/navigation/matrix';
import { hypervisorDashboard } from 'in-openstack/navigation/paths';
import tabs from 'in-openstack/Dashboards/Hypervisors/tabs/index';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function HypervisorDashboard({ location }) {
  const props = {
    regionId: getMatrixParameter(location, hypervisorDashboard, matrixRegionId),
    hypervisorId: getMatrixParameter(location, hypervisorDashboard, matrixHypervisorId),
    viewPath: hypervisorDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      {/* <Breadcrumbs items={HypervisorBreadcrumbs(props)} /> */}
      <ViewTrackingMeta
        data={{
          productArea: 'openstack',
          pageRootName: t('in-openstack:dashboards.hypervisors')
        }}
      />

      <TabView
        result$={getOpenstackHypervisor({
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
