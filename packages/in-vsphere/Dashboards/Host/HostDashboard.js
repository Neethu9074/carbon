/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { datacenterId as matrixDatacenterId } from 'in-vsphere/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { hostId as matrixHostId } from 'in-vsphere/navigation/matrix';
import getVsphereHost from 'in-vsphere/subscriptions/getVsphereHost';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { hostDashboard } from 'in-vsphere/navigation/paths';
import { HostBreadcrumbs } from 'in-vsphere/breadcrumbs';
import tabs from 'in-vsphere/Dashboards/Host/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function HostDashboard({ location }) {
  const props = {
    datacenterId: getMatrixParameter(location, hostDashboard, matrixDatacenterId),
    hostId: getMatrixParameter(location, hostDashboard, matrixHostId),
    viewPath: hostDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={HostBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'vSphere',
          pageRootName: t('in-vsphere:dashboards.vSphereEsXiHost')
        }}
      />

      <TabView
        result$={getVsphereHost({
          filter: {
            datacenterId: props.datacenterId,
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
    <DashboardHeader
      {...props}
      title={t('in-vsphere:dashboards.esXiHost')}
      icon="lib_linux"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
