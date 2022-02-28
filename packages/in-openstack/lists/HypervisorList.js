/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getOpenstackHypervisorsWithDefaults } from 'in-openstack/subscriptions/getOpenstackHypervisors';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import OpenstackNoDataNotification from 'in-openstack/lists/components/OpenstackNoDataNotification';
import { hypervisorList, getOpenstackHypervisorDashboard } from 'in-openstack/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

// import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';

// import { bytesPerSecondZeroDecimalPlaces, percentage } from 'in-services/formatters/number';

// import { TableEntityCounter } from '@instana/components';

const pathSegment = hypervisorList;
const matrixPrefix = 'region.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-openstack:name'),
    getContent(item) {
      return <EntityLink label={item.label} href$={getOpenstackHypervisorDashboard(item.id)} />;
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
  function RegionList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-openstack:regions')} />
        <ViewTrackingMeta
          data={{
            productArea: 'openstack',
            pageRootName: t('in-openstack:regions')
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<OpenstackNoDataNotification icon="lib_openstack" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getOpenstackHypervisorsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getOpenstackHypervisorsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
