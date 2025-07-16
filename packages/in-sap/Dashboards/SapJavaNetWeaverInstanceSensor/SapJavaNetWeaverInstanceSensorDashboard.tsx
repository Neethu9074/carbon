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
import { sapJavaNetWeaverInstanceSensorDashboard } from 'in-sap/navigation/paths';
// @ts-expect-error Module needs to be translated to TS
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
// @ts-expect-error Module needs to be translated to TS
import { SapJavaNetWeaverSensorBreadcrumbs } from 'in-sap/breadcrumbs';
// @ts-expect-error Module needs to be translated to TS
import EntityVersionList from 'in-components/EntityVersionList';
// @ts-expect-error Module needs to be translated to TS
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import getSapJavaNetWeaverInstanceSensor from 'in-sap/subscriptions/getSapJavaNetWeaverInstanceSensor';
import HealthIndicatorButtonPresenter from 'in-components/health/HealthIndicatorButtonPresenter';
import rawTabs from 'in-sap/Dashboards/SapJavaNetWeaverInstanceSensor/tabs/index';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
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

interface LocationProps {
  location: any;
}

interface HeaderProps {
  result: any;
  hostId: string | null | undefined;
  timeConfig: any;
  systemPrefix?: string | null | undefined;
  systemSnapShotPrefix?: string | null | undefined;
  viewPath?: any;
}

const wrappedTabs = rawTabs.map(tab => ({
  ...tab,
  component: (props: any) => <tab.component {...props} data={props.data} />
}));

export default function SapJavaNetWeaverInstanceSensorDashboard({ location }: LocationProps) {
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
        result$={
          props.hostId
            ? getSapJavaNetWeaverInstanceSensor({
                filter: {
                  hostId: props.hostId,
                  timeConfig: props.timeConfig
                }
              })
            : undefined
        }
        HeaderComponent={Header}
        location={location}
        tabs={wrappedTabs}
        props={props}
        renderErrors={(errors: any) => (
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

function Header(props: HeaderProps) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-sap:dashboards.sapJavaInstance')}
      icon="lib_infra_sapJavaNetWeaverInstanceSensor"
      label={get(props.result, ['data', 'serviceName'])}
      renderButtonLine={() => renderButtonLine(props)}
      renderMetaInformation={() => renderMetaInformation(props)}
    />
  );
}

function renderButtonLine(props: HeaderProps) {
  const { hostId, timeConfig } = props;
  return (
    <>
      <EntityHealthIndicator
        IndicatorPresenter={HealthIndicatorButtonPresenter}
        snapshotId={hostId}
        timeConfig={timeConfig}
      />
      <ContextGuide
        id={hostId ?? ''}
        timeConfig={timeConfig}
        plugin={plugins.sapJavaNetWeaverInstanceSensor}
        tagFilters={[
          {
            name: 'related.infra.entity.snapshotId',
            value: hostId,
            operator: 'EQUALS',
            entity: 'NOT_APPLICABLE',
            type: 'TAG_FILTER'
          }
        ]}
      />
    </>
  );
}

function renderMetaInformation(props: { result: any }) {
  const objectType = get(props.result, ['data', 'objectType']);
  if (!objectType) return null;

  return (
    <Tooltip themeStyle="light" content={`Type: ${objectType}`}>
      <WithIcon className={locals.icon} icon="lib_infra_sapJavaNetWeaverInstanceSensor">
        <span className={locals.label}>{objectType}</span>
      </WithIcon>
    </Tooltip>
  );
}
