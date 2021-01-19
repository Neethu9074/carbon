/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import getKubernetesClusters from 'in-subscription/kubernetes/getKubernetesClusters';
import ServerListPresenter from 'in-new-components/lists/List/ServerListPresenter';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import useTimeConfig from 'in-hooks/useTimeConfig';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ item, checkIfSelected, toggleItem }) {
      const isSelected = checkIfSelected(item.id);
      return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(item.id, types.K8S_CLUSTER)} />;
    }
  },
  {
    getContent({ item }) {
      return item.cluster.label;
    }
  }
];

const ServerListWithUrlState = createServerTableWithUrlState({
  Renderer: ServerListPresenter,
  defaultOrderBy: 'name',
  defaultPageSize: 10,
  pathSegment: '/clusters',
  columnDefinitions
});

export default function Selectable({ checkIfSelected, toggleItem }) {
  const timeConfig = useTimeConfig();
  return (
    <ServerListWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      toggleItem={toggleItem}
      checkIfSelected={checkIfSelected}
      onClick={item => toggleItem(item.id, types.K8S_CLUSTER)}
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, query, timeConfig }) {
  return getKubernetesClusters({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      timeConfig
    }
  });
}
