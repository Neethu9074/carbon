/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ServerListPresenter from 'in-components/lists/List/ServerListPresenter';
import getApplications from 'in-subscription/application/getApplications';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import useTimeConfig from 'in-hooks/useTimeConfig';

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
  const timeConfig = useTimeConfig();
  return (
    <ServerListWithUrlState
      get={getTableData}
      timeConfig={timeConfig}
      toggleItem={toggleItem}
      checkIfSelected={checkIfSelected}
      onClick={item => toggleItem(item.application.id, types.APPLICATION)}
    />
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
