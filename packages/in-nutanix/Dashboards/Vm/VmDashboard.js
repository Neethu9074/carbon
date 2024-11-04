/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { vmId as matrixVmId, hostId as matrixHostId } from 'in-nutanix/navigation/matrix';
import { datacenterId as matrixDatacenterId } from 'in-nutanix/navigation/matrix';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import TabView from 'in-components/LocationAwareTabView/TabView';
import getNutanixVm from 'in-nutanix/subscriptions/getNutanixVm';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { productAreas } from 'in-services/tracking/productAreas';
import EntityVersionList from 'in-components/EntityVersionList';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { vmDashboard } from 'in-nutanix/navigation/paths';
import { VmBreadcrumbs } from 'in-nutanix/breadcrumbs';
import tabs from 'in-nutanix/Dashboards/Vm/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { plugins } from 'in-forge/constants';
import Footer from 'in-components/Footer';
import { t } from 'in-i18n';

export default function VMDashboard({ location }) {
  const props = {
    datacenterId: getMatrixParameter(location, vmDashboard, matrixDatacenterId),
    hostId: getMatrixParameter(location, vmDashboard, matrixHostId),
    vmId: getMatrixParameter(location, vmDashboard, matrixVmId),
    viewPath: vmDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <Breadcrumbs items={VmBreadcrumbs(props)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreas.nutanix,
          pageRootName: pageNames.nutanix_vm
        }}
      />

      <TabView
        result$={getNutanixVm({
          filter: {
            vmId: props.vmId,
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
              plugin={plugins.nutanixVM}
              snapshotId={props.vmId}
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
      title={t('in-nutanix:dashboards.nutanixVm')}
      icon={resolveIcon(props)}
      label={get(props.result, ['data', 'label'])}
    />
  );
}

export function resolveIcon(props) {
  const guestFullName = get(props, ['result', 'data', 'guestFullName'], 'linux');
  return guestFullName && guestFullName.toLowerCase().includes('windows') ? 'lib_windows' : 'lib_linux';
}
