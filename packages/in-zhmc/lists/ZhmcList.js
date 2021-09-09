/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { TableEntityCounter } from '@instana/components';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ZhmcNoDataNotification from 'in-zhmc/lists/components/ZhmcNoDataNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { zhmcList, getIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import { getZhmcsWithDefaults } from 'in-zhmc/subscriptions/getZhmcs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = zhmcList;
const matrixPrefix = 'zhmc.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-zhmc:hostname'),
    getContent(item) {
      return <EntityLink label={item.label} href$={getIbmzZhmcDashboard(item.id)} />;
    }
  },
  {
    id: 'systems',
    label: t('in-zhmc:systems'),
    getContent(item) {
      return <TableEntityCounter count={item.systems} />;
    }
  },
  {
    id: 'partitions',
    label: t('in-zhmc:partitions'),
    getContent(item) {
      return <TableEntityCounter count={item.partitions} />;
    }
  },
  {
    id: 'adapters',
    label: t('in-zhmc:adapters'),
    getContent(item) {
      return <TableEntityCounter count={item.adapters} />;
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
  function ZhmcList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-zhmc:ibmzZhmcs')} />
        <ViewTrackingMeta
          data={{
            productArea: 'IBM Z',
            pageRootName: t('in-zhmc:ibmzZhmcs')
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<ZhmcNoDataNotification icon="lib_zhmcConsole" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getZhmcsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getZhmcsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
