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
import { cpcList, getIbmzCpcDashboard } from 'in-zhmc/navigation/paths';
import { getCpcsSubscribeEvent } from 'in-zhmc/subscriptions/getCpcs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = cpcList;
const matrixPrefix = 'cpc.';
const columnDefinitions = [
  {
    id: 'label',
    label: t('in-zhmc:name'),
    getContent(item) {
      return <EntityLink label={item.label} href$={getIbmzCpcDashboard(item.id)} />;
    }
  },
  {
    id: 'dpmEnabled',
    label: t('in-zhmc:mode'),
    getContent(item) {
      return item.mode;
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
  },
  {
    id: 'ipAddress',
    label: t('in-zhmc:ipAddress'),
    getContent(item) {
      return item.ipAddress;
    }
  },
  {
    id: 'machineTypeModel',
    label: t('in-zhmc:machineTypeModel'),
    getContent(item) {
      return item.machineTypeModel;
    }
  },
  {
    id: 'machineSerial',
    label: t('in-zhmc:machineSerial'),
    getContent(item) {
      return item.machineSerial;
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
  function CpcList({ timeConfig }) {
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
  return getCpcsSubscribeEvent(params);
}
function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getCpcsSubscribeEvent({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
