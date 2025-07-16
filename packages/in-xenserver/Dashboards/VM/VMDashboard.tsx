/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { get } from 'lodash';
import React from 'react';

import { hostId as matrixHostId, vmId as matrixVMId } from 'in-xenserver/navigation/matrix';
// @ts-expect-error
import EntityVersionList from 'in-components/EntityVersionList';
// @ts-expect-error
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import { VMBreadcrumbProps } from 'in-xenserver/breadcrumbs/VMBreadcrumb';
import getXenServerVM from 'in-xenserver/subscriptions/getXenServerVM';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { vmDashboard } from 'in-xenserver/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import tabs from 'in-xenserver/Dashboards/VM/tabs/index';
import { VMBreadcrumbs } from 'in-xenserver/breadcrumbs';
import { getTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

interface VMDashboardProps {
  location: Location;
}
export default function VMDashboard({ location }: VMDashboardProps) {
  const vmProps: VMBreadcrumbProps = {
    hostId: getMatrixParameter(location, vmDashboard, matrixHostId),
    vmId: getMatrixParameter(location, vmDashboard, matrixVMId),
    viewPath: vmDashboard,
    timeConfig: getTimeConfig(location)
  };
  return (
    <>
      <Breadcrumbs items={VMBreadcrumbs(vmProps)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.xenserver,
          pageRootName: pageNames.xenserver_vm
        }}
      />
      <TabView
        result$={getXenServerVM({
          filter: {
            vmId: vmProps.vmId,
            hostId: vmProps.hostId,
            timeConfig: vmProps.timeConfig
          },
          pagination: {
            page: 1,
            pageSize: 20
          },
          order: {
            by: 'name',
            direction: 'ASC'
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={vmProps}
        renderErrors={errors => (
          <CenterAlignmentColumn>
            <EntityVersionList
              plugin={plugins.xenServerVM}
              snapshotId={vmProps.hostId}
              timeConfig={vmProps.timeConfig}
              errors={errors}
            />
          </CenterAlignmentColumn>
        )}
      />
      <Footer />
    </>
  );
}

function Header(props: VMBreadcrumbProps) {
  return (
    <DashboardHeader title={t('in-xenserver:vm')} icon="lib_xenserver" label={get(props.result, ['data', 'name'])} />
  );
}
