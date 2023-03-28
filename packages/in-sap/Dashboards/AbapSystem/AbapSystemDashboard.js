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
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import getAbapSystem from 'in-sap/subscriptions/getAbapSystem';
import { abapSystemDashboard } from 'in-sap/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import tabs from 'in-sap/Dashboards/AbapSystem/tabs/index';
import { AbapSystemBreadcrumbs } from 'in-sap/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import WithIcon from 'in-components/WithIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboard.mless';

export default function AbapSystemDashboard({ location }) {
  const props = {
    hostId: getMatrixParameter(location, abapSystemDashboard, matrixHostId),
    systemPrefix: getMatrixParameter(location, abapSystemDashboard, systemPrefix),
    systemSnapShotPrefix: getMatrixParameter(location, abapSystemDashboard, systemSnapShotPrefix),
    viewPath: abapSystemDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <Fragment>
      <Breadcrumbs items={AbapSystemBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'SAP',
          pageRootName: t('in-sap:dashboards.AbapSystem')
        }}
      />
      <TabView
        result$={getAbapSystem({
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
              plugin={plugins.abapSystem}
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
      title={t('in-sap:dashboards.AbapSystem')}
      icon="lib_sap_system"
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
          <WithIcon className={locals.icon} icon="lib_sap_system">
            <span className={locals.label}>{objectType}</span>
          </WithIcon>
        </Tooltip>
      )}
    </>
  );
}
