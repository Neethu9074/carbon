import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ItemList from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/ItemList';
import ServerListPresenter from 'in-new-components/lists/List/ServerListPresenter';
import getApplications from 'in-subscription/application/getApplications';
import CheckboxFancy from 'in-components/form/CheckboxFancy';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ item, checkIfSelected, toggleItem }) {
      const isSelected = checkIfSelected(item.application.id);
      return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(item.application.id, types.APPLICATION)} />;
    }
  },
  {
    getContent({ item }) {
      return item.application.label;
    }
  }
];

const ServerListWithUrlState = createServerTableWithUrlState({
  Renderer: ServerListPresenter,
  defaultOrderBy: 'applicationLabel',
  defaultPageSize: 10,
  pathSegment: '/applications',
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
          onClick={item => toggleItem(item.application.id, types.APPLICATION)}
        />
      )}
    </ItemList>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, query, timeConfig }) {
  return getApplications({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {},
    filter: {
      label: query,
      timeConfig
    },
    contextScope: 'NONE',
    tagFilters: null
  });
}
