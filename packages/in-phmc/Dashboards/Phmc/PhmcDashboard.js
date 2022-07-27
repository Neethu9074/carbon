/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { consoleId as matrixconsoleId } from 'in-phmc/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { phmcDashboard } from 'in-phmc/navigation/paths';
import tabs from 'in-phmc/Dashboards/Phmc/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { PhmcBreadcrumbs } from 'in-phmc/breadcrumbs';
import getPhmc from 'in-phmc/subscriptions/getPhmc';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function PhmcDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, phmcDashboard, matrixconsoleId),
    viewPath: phmcDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <Fragment>
      <Breadcrumbs items={PhmcBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'IBM P',
          pageRootName: t('in-phmc:dashboards.phmc')
        }}
      />

      <TabView
        result$={getPhmc({
          filter: {
            consoleId: props.consoleId,
            timeConfig: props.timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />

      <Footer />
    </Fragment>
  );
}

function Header(props) {
  return (
    <DashboardHeader {...props} title={t('in-phmc:dashboards.phmc')} label={get(props.result, ['data', 'label'])} />
  );
}
