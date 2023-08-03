/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { consoleId as matrixConsoleId } from 'in-phmc/navigation/matrix';
import { systemId as matrixSystemId } from 'in-phmc/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { systemDashboard } from 'in-phmc/navigation/paths';
import tabs from 'in-phmc/Dashboards/Systems/tabs/index';
import getSystem from 'in-phmc/subscriptions/getSystem';
import { SystemBreadcrumbs } from 'in-phmc/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function SystemDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, systemDashboard, matrixConsoleId),
    systemId: getMatrixParameter(location, systemDashboard, matrixSystemId),
    viewPath: systemDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <Fragment>
      <Breadcrumbs items={SystemBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'IBM Power HMC',
          pageRootName: t('in-phmc:dashboards.systems')
        }}
      />

      <TabView
        result$={getSystem({
          filter: {
            consoleId: props.consoleId,
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
              snapshotId={props.systemId}
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
    <DashboardHeader {...props} title={t('in-phmc:dashboards.systems')} label={get(props.result, ['data', 'label'])} />
  );
}
