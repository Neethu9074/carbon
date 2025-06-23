/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import getSapJavaNetWeaverInstanceSensor from 'in-sap/subscriptions/getSapJavaNetWeaverInstanceSensor';
import { hostId as matrixHostId, systemPrefix, systemSnapShotPrefix } from 'in-sap/navigation/matrix';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import { sapJavaNetWeaverInstanceSensorDashboard } from 'in-sap/navigation/paths';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import tabs from 'in-sap/Dashboards/SapJavaNetWeaverInstanceSensor/tabs/index';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { SapJavaNetWeaverSensorBreadcrumbs } from 'in-sap/breadcrumbs';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { getTimeConfig } from 'in-stores/time/config';
import WithIcon from 'in-components/WithIcon';
import { plugins } from 'in-forge/constants';
import Tooltip from 'in-components/Tooltip';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboard.mless';

export default function SapJavaNetWeaverInstanceSensorDashboard({ location }) {
  const props = {
    hostId: getMatrixParameter(location, sapJavaNetWeaverInstanceSensorDashboard, matrixHostId),
    systemPrefix: getMatrixParameter(location, sapJavaNetWeaverInstanceSensorDashboard, systemPrefix),
    systemSnapShotPrefix: getMatrixParameter(location, sapJavaNetWeaverInstanceSensorDashboard, systemSnapShotPrefix),
    viewPath: sapJavaNetWeaverInstanceSensorDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={SapJavaNetWeaverSensorBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.sap_java_instance
        }}
      />

      <TabView
        result$={getSapJavaNetWeaverInstanceSensor({
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
              plugin={plugins.sapJavaNetWeaverInstanceSensor}
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
      label={get(props.result, ['data', 'serviceName'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine(props) {
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={props.hostId}
        timeConfig={props.timeConfig}
      />
      <ContextGuide
        id={props.hostId}
        timeConfig={props.timeConfig}
        plugin={plugins.sapJavaNetWeaverInstanceSensor}
        tagFilters={[{ name: 'related.infra.entity.snapshotId', value: props.hostId, operator: 'EQUALS' }]}
      />
    </>
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
