/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import getOpenstackRegion from 'in-openstack/subscriptions/getOpenstackRegion';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { regionId as matrixRegionId } from 'in-openstack/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { regionDashboard } from 'in-openstack/navigation/paths';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import tabs from 'in-openstack/Dashboards/Regions/tabs/index';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { RegionBreadcrumbs } from 'in-openstack/breadcrumbs';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function RegionDashboard({ location }) {
  const props = {
    regionId: getMatrixParameter(location, regionDashboard, matrixRegionId),
    viewPath: regionDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={RegionBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'OpenStack',
          pageRootName: t('in-openstack:dashboards.regions')
        }}
      />

      <TabView
        result$={getOpenstackRegion({
          filter: {
            regionId: props.regionId,
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
              plugin={plugins.openstackRegion}
              snapshotId={props.regionId}
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
      title={t('in-openstack:dashboards.openstackRegions')}
      icon="lib_openstack"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
