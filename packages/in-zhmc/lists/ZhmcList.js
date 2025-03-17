/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import ZhmcNoDataNotification from 'in-zhmc/lists/components/ZhmcNoDataNotification';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { getZhmcsWithDefaults } from 'in-zhmc/subscriptions/getZhmcs';
import ZhmcLabel from 'in-zhmc/Dashboards/commonComponents/ZhmcLabel';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { zhmcList } from 'in-zhmc/navigation/paths';
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
      return <ZhmcLabel item={item} />;
    }
  },
  {
    id: 'systems',
    label: t('in-zhmc:systems'),
    getContent(item) {
      return item.systems;
    }
  },
  {
    id: 'partitions',
    label: t('in-zhmc:partitions'),
    getContent(item) {
      return item.partitions;
    }
  },
  {
    id: 'adapters',
    label: t('in-zhmc:adapters'),
    getContent(item) {
      return item.adapters;
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
            productArea: productAreas.ibmZ,
            pageRootName: pageNames.ibm_zhmcs
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <ZhmcNoDataNotification icon="lib_zhmcConsole" />}
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
