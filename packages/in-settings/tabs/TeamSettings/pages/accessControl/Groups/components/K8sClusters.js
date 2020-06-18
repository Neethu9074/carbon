import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/ItemList';
import getKubernetesClusters from 'in-subscription/kubernetes/getKubernetesClusters';
import ServerListPresenter from 'in-new-components/lists/List/ServerListPresenter';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

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
  return (
    <ItemList>
      {({ timeConfig }) => (
        <ServerListWithUrlState
          get={getTableData}
          timeConfig={timeConfig}
          toggleItem={toggleItem}
          checkIfSelected={checkIfSelected}
          onClick={item => toggleItem(item.id, types.K8S_CLUSTER)}
        />
      )}
    </ItemList>
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
