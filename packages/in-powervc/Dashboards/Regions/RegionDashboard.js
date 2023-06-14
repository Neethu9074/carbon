/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { regionId as matrixRegionId } from 'in-powervc/navigation/matrix';
import getPowerVCRegion from 'in-powervc/subscriptions/getPowerVCRegion';
import { powervcRegionDashboard } from 'in-powervc/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-powervc/Dashboards/Regions/tabs/index';
import DashboardHeader from 'in-components/DashboardHeader';
import { RegionBreadcrumbs } from 'in-powervc/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function RegionDashboard({ location }) {
  const props = {
    regionId: getMatrixParameter(location, powervcRegionDashboard, matrixRegionId),
    viewPath: powervcRegionDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={RegionBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'PowerVC',
          pageRootName: t('in-powervc:dashboards.regions')
        }}
      />

      <TabView
        result$={getPowerVCRegion({
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
              plugin={plugins.powervcRegion}
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
      title={t('in-powervc:dashboards.powervcRegions')}
      icon="lib_powervc"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
