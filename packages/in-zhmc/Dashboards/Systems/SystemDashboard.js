/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { consoleId as matrixconsoleId } from 'in-zhmc/navigation/matrix';
import { cpcId as matrixCpcId } from 'in-zhmc/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import tabs from 'in-zhmc/Dashboards/Systems/tabs/index';
import { cpcDashboard } from 'in-zhmc/navigation/paths';
import { SystemBreadcrumb } from 'in-zhmc/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import getCpc from 'in-zhmc/subscriptions/getCpc';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function SystemDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, cpcDashboard, matrixconsoleId),
    cpcId: getMatrixParameter(location, cpcDashboard, matrixCpcId),
    viewPath: cpcDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={SystemBreadcrumb(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'IBM Z',
          pageRootName: t('in-zhmc:dashboards.systems')
        }}
      />

      <TabView
        result$={getCpc({
          filter: {
            consoleId: props.consoleId,
            cpcId: props.cpcId,
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
              plugin={plugins.zhmcConsole}
              snapshotId={props.cpcId}
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
      title={t('in-zhmc:dashboards.systems')}
      icon="lib_zhmcConsole"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
