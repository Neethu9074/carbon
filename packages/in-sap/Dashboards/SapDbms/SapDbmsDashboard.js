/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { hostId as matrixHostId, systemPrefix, systemSnapShotPrefix } from 'in-sap/navigation/matrix';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { sapDbmsDashboard } from 'in-sap/navigation/paths';
import { pageNames } from 'in-services/tracking/pageNames';
import getSAPDbms from 'in-sap/subscriptions/getSAPDbms';
import tabs from 'in-sap/Dashboards/SapDbms/tabs/index';
import { SapDbmsBreadcrumbs } from 'in-sap/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import WithIcon from 'in-components/WithIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboard.mless';

export default function SapDbmsDashboard({ location }) {
  const props = {
    hostId: getMatrixParameter(location, sapDbmsDashboard, matrixHostId),
    systemPrefix: getMatrixParameter(location, sapDbmsDashboard, systemPrefix),
    systemSnapShotPrefix: getMatrixParameter(location, sapDbmsDashboard, systemSnapShotPrefix),
    viewPath: sapDbmsDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={SapDbmsBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.sap_dbms
        }}
      />

      <TabView
        result$={getSAPDbms({
          filter: {
            hostId: props.hostId,
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
              plugin={plugins.sapDbms}
              snapshotId={props.hostId}
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
      title={t('in-sap:dashboards.SapDbms')}
      icon="lib_sap_dbms"
      label={get(props.result, ['data', 'name'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine(props) {
  return (
    <EntityHealthIndicator
      IndicatorPresenter={HealthIndicatorButtonPresenter}
      snapshotId={props.hostId}
      timeConfig={props.timeConfig}
    />
  );
}

function renderMetaInformation({ result }) {
  const objectType = get(result, ['data', 'objectType']);
  return (
    <>
      {objectType && (
        <Tooltip themeStyle="light" content={`Type: ${objectType}`}>
          <WithIcon className={locals.icon} icon="lib_sap_dbms">
            <span className={locals.label}>{objectType}</span>
          </WithIcon>
        </Tooltip>
      )}
    </>
  );
}
