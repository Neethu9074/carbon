/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import { getVSphereDatacentersWithDefaults } from 'in-vsphere/subscriptions/getVsphereDatacenters';
import VSphereNoDataNotification from 'in-vsphere/lists/components/VSphereNoDataNotification';
import { bytesPerSecondZeroDecimalPlaces, percentage } from 'in-services/formatters/number';
import { datacenterList, getVsphereDatacenterDashboard } from 'in-vsphere/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import EntityCounter from 'in-components/tables/sharedComponents/EntityCounter';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = datacenterList;
const matrixPrefix = 'datacenter.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-vsphere:name'),
    getContent(item) {
      return (
        <EntityLink label={item.label} href$={getVsphereDatacenterDashboard(item.id)} icon="lib_vsphere_datacenter" />
      );
    }
  },
  {
    id: 'hosts',
    label: t('in-vsphere:esXiHosts'),
    getContent(item) {
      return <EntityCounter icon="lib_linux" count={item.hosts} />;
    }
  },
  {
    id: 'vms',
    label: t('in-vsphere:virtualMachines'),
    getContent(item) {
      return <EntityCounter icon="lib_vsphere_vm" count={item.vms} />;
    }
  },
  {
    id: 'cpuUsage',
    label: t('in-vsphere:cpuUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="cpu.usage.percent.maximum.*"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-vsphere:memoryUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.compact}
          metric="mem.usage.average.percent"
        />
      );
    }
  },
  {
    id: 'networkUtilization',
    label: t('in-vsphere:networkUtilization'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={bytesPerSecondZeroDecimalPlaces}
          metric="net.received.average.bytesPerSecond"
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'name',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function DatacenterList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-vsphere:vSphereDatacenters')} />
        <ViewTrackingMeta
          data={{
            productArea: 'vSphere',
            pageRootName: t('in-vsphere:vSphereDatacenters')
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<VSphereNoDataNotification icon="lib_vsphere" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getVSphereDatacentersWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getVSphereDatacentersWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
