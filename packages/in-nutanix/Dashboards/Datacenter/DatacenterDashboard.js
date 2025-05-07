/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { datacenterId as matrixDatacenterId } from 'in-nutanix/navigation/matrix';
import getNutanixDatacenter from 'in-nutanix/subscriptions/getNutanixDatacenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { datacenterDashboard } from 'in-nutanix/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import tabs from 'in-nutanix/Dashboards/Datacenter/tabs/index';
import { DatacenterBreadcrumbs } from 'in-nutanix/breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import BadgeList from 'in-components/BadgeList/BadgeList';
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
          productArea: productAreas.nutanix,
          pageRootName: pageNames.nutanix_data_center
        }}
      />

      <TabView
        result$={getNutanixDatacenter({
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
              plugin={plugins.nutanixDatacenter}
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
      title={t('in-nutanix:dashboards.nutanixDatacenter')}
      icon="lib_nutanix"
      label={get(props.result, ['data', 'label'])}
      renderMetaInformation={RenderMetaInformation}
    />
  );
}

function RenderMetaInformation({ result }) {
  const version = get(result, ['data', 'version']);
  return <>{version && <BadgeList type={version} getColor={() => 'blue'} />}</>;
}
