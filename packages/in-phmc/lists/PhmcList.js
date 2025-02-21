/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import PhmcNoDataNotification from 'in-phmc/lists/components/PhmcNoDataNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { phmcList, useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import { getPhmcsWithDefaults } from 'in-phmc/subscriptions/getPhmcs';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { pageNames } from 'in-services/tracking/pageNames';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = phmcList;
const matrixPrefix = 'phmc.';

function EntityLinkLabel({ item }) {
  const getIbmpPhmcDashboard = useIbmpPhmcDashboard();

  return <EntityLink label={item.label} href={getIbmpPhmcDashboard(item.id)} />;
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-phmc:hostname'),
    getContent(item) {
      return <EntityLinkLabel item={item} />;
    }
  },
  {
    id: 'systems',
    label: t('in-phmc:systems'),
    getContent(item) {
      return item.systems;
    }
  },
  {
    id: 'partitions',
    label: t('in-phmc:partitions'),
    getContent(item) {
      return item.partitions;
    }
  },
  {
    id: 'vios',
    label: t('in-phmc:vios'),
    getContent(item) {
      return item.vios;
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
  function PhmcList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-phmc:ibmpPhmcs')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.ibmpower,
            pageRootName: pageNames.ibmp_phmcs
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <PhmcNoDataNotification />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getPhmcsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getPhmcsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
