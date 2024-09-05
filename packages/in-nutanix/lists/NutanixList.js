/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { TableEntityCounter } from '@instana/legacy';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { timeConfig$, urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import NutanixNoDataNotification from 'in-nutanix/lists/components/NutanixNoDataNotification';
import { getNutanixWithDefaults } from 'in-nutanix/subscriptions/getNutanix';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { nutanix } from 'in-nutanix/navigation/paths';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = nutanix;
const matrixPrefix = 'nutanix.';

const columnDefinitions = [
  {
    id: 'consoleName',
    label: t('in-nutanix:name'),
    getContent(item) {
      return item.consoleName;
    }
  },
  {
    id: 'type',
    label: t('in-nutanix:type'),
    getContent(item) {
      return item.type;
    }
  },
  {
    id: 'noOfClusters',
    label: t('in-nutanix:noOfClusters'),
    getContent(item) {
      return <TableEntityCounter count={item.clusters} />;
    }
  },
  {
    id: 'noOfHosts',
    label: t('in-nutanix:noOfHosts'),
    getContent(item) {
      return <TableEntityCounter count={item.hosts} />;
    }
  },
  {
    id: 'noOfVms',
    label: t('in-nutanix:noOfVms'),
    getContent(item) {
      return <TableEntityCounter count={item.vms} />;
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'consoleName',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});
export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function NutanixList({ timeConfig }) {
    return (
      <>
        <Title title={t('in-nutanix:nutanix')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.nutanix,
            pageRootName: pageNames.nutanix_clusters
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={() => <NutanixNoDataNotification />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </>
    );
  }
);

function getTableData(params) {
  return getNutanixWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getNutanixWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
