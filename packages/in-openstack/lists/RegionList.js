/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import OpenstackNoDataNotification from 'in-openstack/lists/components/OpenstackNoDataNotification';
import { getOpenstackRegionsWithDefaults } from 'in-openstack/subscriptions/getOpenstackRegions';
import { regionList, getOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = regionList;
const matrixPrefix = 'region.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-openstack:name'),
    getContent(item) {
      return <EntityLink label={item.label} href$={getOpenstackRegionDashboard(item.id)} />;
    }
  },
  {
    id: 'openstack',
    label: t('in-openstack:openstack'),
    getContent(item) {
      return item.openstackId;
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
          FallbackComponent={() => <OpenstackNoDataNotification icon="lib_openstack" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getOpenstackRegionsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getOpenstackRegionsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
