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
import getSapAbapSensor from 'in-sap/subscriptions/getSapAbapSensor';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { sapAbapSensorDashboard } from 'in-sap/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import tabs from 'in-sap/Dashboards/SapAbapSensor/tabs/index';
import { SapAbapSensorBreadcrumbs } from 'in-sap/breadcrumbs';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { getTimeConfig } from 'in-stores/time/config';
import WithIcon from 'in-components/WithIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboard.mless';

export default function SapAbapSensorDashboard({ location }) {
  const props = {
    hostId: getMatrixParameter(location, sapAbapSensorDashboard, matrixHostId),
    systemPrefix: getMatrixParameter(location, sapAbapSensorDashboard, systemPrefix),
    systemSnapShotPrefix: getMatrixParameter(location, sapAbapSensorDashboard, systemSnapShotPrefix),
    viewPath: sapAbapSensorDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={SapAbapSensorBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.sap_abap_sensor
        }}
      />

      <TabView
        result$={getSapAbapSensor({
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
              plugin={plugins.sapAbap}
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
      title={t('in-sap:dashboards.AbapInstance')}
      icon="lib_sap_instances"
      label={get(props.result, ['data', 'serviceName'])}
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
