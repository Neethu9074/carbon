/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { hypervisorId as matrixHypervisorId } from 'in-powervc/navigation/matrix';
import getPowerVCHypervisor from 'in-powervc/subscriptions/getPowerVCHypervisor';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { regionId as matrixRegionId } from 'in-powervc/navigation/matrix';
import { powervcHypervisorDashboard } from 'in-powervc/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-powervc/Dashboards/Hypervisors/tabs/index';
import EntityVersionList from 'in-components/EntityVersionList';
import { HypervisorBreadcrumbs } from 'in-powervc/breadcrumbs';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { getTimeConfig } from 'in-stores/time/config';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function HypervisorDashboard({ location }) {
  const props = {
    regionId: getMatrixParameter(location, powervcHypervisorDashboard, matrixRegionId),
    hypervisorId: getMatrixParameter(location, powervcHypervisorDashboard, matrixHypervisorId),
    viewPath: powervcHypervisorDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={HypervisorBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: 'PowerVC',
          pageRootName: t('in-powervc:dashboards.hypervisors')
        }}
      />

      <TabView
        result$={getPowerVCHypervisor({
          filter: {
            regionId: props.regionId,
            hypervisorId: props.hypervisorId,
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
              snapshotId={props.hypervisorId}
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
      title={t('in-powervc:dashboards.hypervisors')}
      label={get(props.result, ['data', 'label'])}
    />
  );
}
