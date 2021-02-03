/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ServerListPresenter from 'in-new-components/lists/List/ServerListPresenter';
import getWebsites from 'in-websites/subscriptions/getWebsites';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import useTimeConfig from 'in-hooks/useTimeConfig';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ item, checkIfSelected, toggleItem }) {
      const isSelected = checkIfSelected(item.website.id);
      return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(item.website.id, types.WEBSITE)} />;
    }
  },
  {
    getContent({ item }) {
      return item.website.label;
    }
  }
];

const ServerListWithUrlState = createServerTableWithUrlState({
  Renderer: ServerListPresenter,
  defaultOrderBy: 'websiteLabel',
  defaultPageSize: 10,
  pathSegment: '/websites',
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
      onClick={item => toggleItem(item.website.id, types.WEBSITE)}
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, query, timeConfig }) {
  return getWebsites({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    metrics: {},
    labelFilter: query,
    timeConfig
  });
}
