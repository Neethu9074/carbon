/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import {
  sharedProcessorPoolId as matrixSharedProcessorPoolId,
  systemId as matrixSystemId
} from 'in-phmc/navigation/matrix';
import getSharedProcessorPool from 'in-phmc/subscriptions/getSharedProcessorPool';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { consoleId as matrixConsoleId } from 'in-phmc/navigation/matrix';
import tabs from 'in-phmc/Dashboards/SharedProcessorPool/tabs/index';
import { SharedProcessorPoolBreadcrumbs } from 'in-phmc/breadcrumbs';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { sppDashboard } from 'in-phmc/navigation/paths';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function SharedProcessorPoolDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, sppDashboard, matrixConsoleId),
    systemId: getMatrixParameter(location, sppDashboard, matrixSystemId),
    sharedProcessorPoolId: getMatrixParameter(location, sppDashboard, matrixSharedProcessorPoolId),
    viewPath: sppDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={SharedProcessorPoolBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'IBM Power',
          pageRootName: t('in-phmc:dashboards.sharedProcessorPool')
        }}
      />

      <TabView
        result$={getSharedProcessorPool({
          filter: {
            sharedProcessorPoolId: props.sharedProcessorPoolId,
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
              snapshotId={props.sharedProcessorPoolId}
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
      title={t('in-phmc:dashboards.sharedProcessorPool')}
      label={get(props.result, ['data', 'label'])}
    />
  );
}
