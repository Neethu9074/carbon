/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { viosId as matrixViosId, systemId as matrixSystemId } from 'in-phmc/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { consoleId as matrixConsoleId } from 'in-phmc/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { viosDashboard } from 'in-phmc/navigation/paths';
import tabs from 'in-phmc/Dashboards/Vios/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { ViosBreadcrumbs } from 'in-phmc/breadcrumbs';
import getVIOS from 'in-phmc/subscriptions/getVios';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function ViosDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, viosDashboard, matrixConsoleId),
    systemId: getMatrixParameter(location, viosDashboard, matrixSystemId),
    viosId: getMatrixParameter(location, viosDashboard, matrixViosId),
    viewPath: viosDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <Fragment>
      <Breadcrumbs items={ViosBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'IBM Power',
          pageRootName: t('in-phmc:dashboards.vios')
        }}
      />
      <TabView
        result$={getVIOS({
          filter: {
            viosId: props.viosId,
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
              snapshotId={props.viosId}
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
    <DashboardHeader {...props} title={t('in-phmc:dashboards.vios')} label={get(props.result, ['data', 'label'])} />
  );
}
