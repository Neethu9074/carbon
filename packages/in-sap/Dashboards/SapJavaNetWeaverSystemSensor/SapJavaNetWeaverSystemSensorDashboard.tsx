/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

// @ts-expect-error Module needs to be translated to TS
import { hostId as matrixHostId, systemPrefix, systemSnapShotPrefix } from 'in-sap/navigation/matrix';
// @ts-expect-error Module needs to be translated to TS
import { sapJavaNetWeaverSystemSensorDashboard } from 'in-sap/navigation/paths';
// @ts-expect-error Module needs to be translated to TS
import { SapJavaNetWeaverSystemSensorBreadcrumbs } from 'in-sap/breadcrumbs';
// @ts-expect-error Module needs to be translated to TS
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
// @ts-expect-error Module needs to be translated to TS
import EntityVersionList from 'in-components/EntityVersionList';
// @ts-expect-error Module needs to be translated to TS
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import getSapJavaNetWeaverSystemSensor from 'in-sap/subscriptions/getSapJavaNetWeaverSystemSensor';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import tabs from 'in-sap/Dashboards/SapJavaNetWeaverSystemSensor/tabs/index';
import ContextGuide from 'in-components/ContextGuide/ContextGuide';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
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

export default function SapJavaNetWeaverSystemSensorDashboard({ location }: { location: any }) {
  const props = {
    hostId: getMatrixParameter(location, sapJavaNetWeaverSystemSensorDashboard, matrixHostId) ?? '',
    systemPrefix: getMatrixParameter(location, sapJavaNetWeaverSystemSensorDashboard, systemPrefix) ?? '',
    systemSnapShotPrefix:
      getMatrixParameter(location, sapJavaNetWeaverSystemSensorDashboard, systemSnapShotPrefix) ?? '',
    viewPath: sapJavaNetWeaverSystemSensorDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={SapJavaNetWeaverSystemSensorBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.sap,
          pageRootName: pageNames.sap_java_system
        }}
      />

      <TabView
        result$={getSapJavaNetWeaverSystemSensor({
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
              plugin={plugins.sapJavaNetWeaverSystemSensor}
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

type HeaderProps = {
  result: any;
  [key: string]: any;
};

function Header(props: HeaderProps) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-sap:dashboards.SapJavaSystem')}
      icon="lib_infra_sapJavaNetWeaverSystemSensor"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
    />
  );
}

function renderButtonLine(props: { hostId: string; timeConfig: any }) {
  const { hostId, timeConfig } = props;
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={hostId}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={props.hostId}
        timeConfig={props.timeConfig}
        plugin={plugins.sapJavaNetWeaverSystemSensor}
        tagFilters={[
          {
            name: 'related.infra.entity.snapshotId',
            value: props.hostId,
            operator: 'EQUALS',
            entity: 'NOT_APPLICABLE',
            type: 'TAG_FILTER'
          }
        ]}
      />
    </>
  );
}

function renderMetaInformation({ result }: { result: any }) {
  const objectType = get(result, ['data', 'objectType']);
  return (
    <>
      {objectType && (
        <Tooltip themeStyle="light" content={`Type: ${objectType}`}>
          <WithIcon className={locals.icon} icon="lib_infra_sapJavaNetWeaverSystemSensor">
            <span className={locals.label}>{objectType}</span>
          </WithIcon>
        </Tooltip>
      )}
    </>
  );
}
