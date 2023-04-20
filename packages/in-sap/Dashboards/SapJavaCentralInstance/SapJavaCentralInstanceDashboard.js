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
import { sapJavaCentralInstanceDashboard } from 'in-sap/navigation/paths';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import tabs from 'in-sap/Dashboards/SapJavaCentralInstance/tabs/index';
import getJavaInstance from 'in-sap/subscriptions/getJavaInstance';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import EntityVersionList from 'in-components/EntityVersionList';
import { SapJavaInstanceBreadcrumbs } from 'in-sap/breadcrumbs';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import WithIcon from 'in-components/WithIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboard.mless';

export default function SapJavaCentralInstanceDashboard({ location }) {
  const props = {
    hostId: getMatrixParameter(location, sapJavaCentralInstanceDashboard, matrixHostId),
    systemPrefix: getMatrixParameter(location, sapJavaCentralInstanceDashboard, systemPrefix),
    systemSnapShotPrefix: getMatrixParameter(location, sapJavaCentralInstanceDashboard, systemSnapShotPrefix),
    viewPath: sapJavaCentralInstanceDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <Fragment>
      <Breadcrumbs items={SapJavaInstanceBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'SAP',
          pageRootName: t('in-sap:dashboards.sapJavaInstance')
        }}
      />

      <TabView
        result$={getJavaInstance({
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
              plugin={plugins.sapJavaInstance}
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
      title={t('in-sap:dashboards.sapJavaInstance')}
      icon="lib_sap_instances"
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
          <WithIcon className={locals.icon} icon="lib_sap_instances">
            <span className={locals.label}>{objectType}</span>
          </WithIcon>
        </Tooltip>
      )}
    </>
  );
}
