/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import getVsphereDatacenter from 'in-vsphere/subscriptions/getVsphereDatacenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { datacenterDashboard } from 'in-vsphere/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import tabs from 'in-vsphere/Dashboards/Datacenter/tabs/index';
import { DatacenterBreadcrumbs } from 'in-vsphere/breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

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
          pageRootName: t('in-vsphere:dashboards.vSphereDatacenter')
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
      title={t('in-vsphere:dashboards.vSphereDatacenter')}
      icon="lib_vsphere_datacenter"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
