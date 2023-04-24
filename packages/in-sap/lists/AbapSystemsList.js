/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { Fragment } from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import { getHumanReadablePluginName } from 'in-sap/Dashboards/tables/getHumanReadablePluginName';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { getAbapSystemListsWithDefaults } from 'in-sap/subscriptions/getAbapSystemLists';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import SapNoDataNotification from 'in-sap/lists/components/SapNoDataNotification';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { getDashboardForEntity } from 'in-sap/navigation/paths';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { sapSystemsList } from 'in-sap/navigation/paths';
import { timeConfig$ } from 'in-stores/time/config';
import EntityLink from 'in-components/EntityLink';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const pathSegment = sapSystemsList;
const matrixPrefix = 'abapjavasystemslist.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item) {
      return (
        <EntityLink
          icon={getIconType(item.pluginName)}
          label={item.label}
          href$={getDashboardForEntity(item.id, item.pluginName, item.label)}
        />
      );
    }
  },
  {
    id: 'objectType',
    label: t('in-sap:objectType'),
    getContent(item) {
      return getHumanReadablePluginName(item);
    }
  },
  {
    id: 'hostName',
    label: t('in-sap:hostName'),
    getContent(item) {
      return item.hostName;
    }
  },
  {
    id: 'health',
    label: t('in-sap:health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function AbapSystemsList({ timeConfig }) {
    return (
      <Fragment>
        <Title title={t('in-sap:abapSystems')} />
        <ViewTrackingMeta
          data={{
            productArea: 'SAP',
            pageRootName: t('in-sap:abapSystems')
          }}
        />

        <WithEmptyStateFallback
          getHasDataToRender={getHasDataToRender}
          FallbackComponent={<SapNoDataNotification icon="lib_sap" />}
        >
          <ServerTableWithUrlState get={getTableData} timeConfig={timeConfig} />
        </WithEmptyStateFallback>
      </Fragment>
    );
  }
);

function getTableData(params) {
  return getAbapSystemListsWithDefaults(params);
}

function getHasDataToRender() {
  return timeConfig$
    .flatMap(timeConfig => getAbapSystemListsWithDefaults({ timeConfig }))
    .map(result => !result.data || result.data.totalHits > 0);
}
