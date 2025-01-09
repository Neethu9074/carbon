/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { datacenterId as matrixDatacenterId } from 'in-nutanix/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { hostId as matrixHostId } from 'in-nutanix/navigation/matrix';
import getNutanixHost from 'in-nutanix/subscriptions/getNutanixHost';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { hostDashboard } from 'in-nutanix/navigation/paths';
import { pageNames } from 'in-services/tracking/pageNames';
import { HostBreadcrumbs } from 'in-nutanix/breadcrumbs';
import tabs from 'in-nutanix/Dashboards/Host/tabs/index';
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
          productArea: productAreas.nutanix,
          pageRootName: pageNames.nutanix_esxi_host
        }}
      />

      <TabView
        result$={getNutanixHost({
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
              plugin={plugins.nutanixHost}
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
    <DashboardHeader {...props} title={t('in-nutanix:dashboards.hosts')} label={get(props.result, ['data', 'label'])} />
  );
}
