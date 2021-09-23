/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { consoleId as matrixconsoleId } from 'in-zhmc/navigation/matrix';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { zhmcDashboard } from 'in-zhmc/navigation/paths';
import tabs from 'in-zhmc/Dashboards/Zhmc/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { ZhmcBreadcrumb } from 'in-zhmc/breadcrumbs';
import getZhmc from 'in-zhmc/subscriptions/getZhmc';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function ZhmcDashboard({ location }) {
  const props = {
    consoleId: getMatrixParameter(location, zhmcDashboard, matrixconsoleId),
    viewPath: zhmcDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={ZhmcBreadcrumb(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'IBM Z',
          pageRootName: t('in-zhmc:dashboards.zhmc')
        }}
      />

      <TabView
        result$={getZhmc({
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
    <DashboardHeader
      {...props}
      title={t('in-zhmc:dashboards.zhmc')}
      icon="lib_zhmcConsole"
      label={get(props.result, ['data', 'label'])}
    />
  );
}
