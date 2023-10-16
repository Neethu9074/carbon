/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { lparId as matrixLparId, systemId as matrixSystemId } from 'in-phmc/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { consoleId as matrixConsoleId } from 'in-phmc/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { lparDashboard } from 'in-phmc/navigation/paths';
import tabs from 'in-phmc/Dashboards/Lpar/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { LparBreadcrumbs } from 'in-phmc/breadcrumbs';
import getLpar from 'in-phmc/subscriptions/getLpar';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function LparDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, lparDashboard, matrixConsoleId),
    systemId: getMatrixParameter(location, lparDashboard, matrixSystemId),
    lparId: getMatrixParameter(location, lparDashboard, matrixLparId),
    viewPath: lparDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={LparBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.ibmpower,
          pageRootName: pageNames.logical_partition_summary
        }}
      />

      <TabView
        result$={getLpar({
          filter: {
            lparId: props.lparId,
            systemId: props.systemId,
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
              plugin={plugins.phmcConsole}
              snapshotId={props.lparId}
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
      title={t('in-phmc:dashboards.logicalPartition')}
      label={get(props.result, ['data', 'label'])}
    />
  );
}
