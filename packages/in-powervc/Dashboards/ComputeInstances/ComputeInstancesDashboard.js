/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { instanceId as matrixInstanceId } from 'in-powervc/navigation/matrix';
import getPowerVCInstance from 'in-powervc/subscriptions/getPowerVCInstance';
import { regionId as matrixRegionId } from 'in-powervc/navigation/matrix';
import { powervcInstanceDashboard } from 'in-powervc/navigation/paths';
import tabs from 'in-powervc/Dashboards/ComputeInstances/tabs/index';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function ComputeInstancesDashboard({ location }) {
  const props = {
    regionId: getMatrixParameter(location, powervcInstanceDashboard, matrixRegionId),
    instanceId: getMatrixParameter(location, powervcInstanceDashboard, matrixInstanceId),
    viewPath: powervcInstanceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.power_vc,
          pageRootName: pageNames.powervc_compute_Instances
        }}
      />

      <TabView
        result$={getPowerVCInstance({
          filter: {
            regionId: props.regionId,
            instanceId: props.instanceId,
            timeConfig: props.timeConfig
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList snapshotId={props.instanceId} timeConfig={props.timeConfig} errors={errors} />
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
      title={t('in-powervc:dashboards.computeInstances')}
      label={get(props.result, ['data', 'label'])}
    />
  );
}
