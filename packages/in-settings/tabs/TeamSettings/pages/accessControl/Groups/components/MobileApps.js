/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { types } from 'in-settings/tabs/TeamSettings/pages/accessControl/Areas/permissionSetResultFilter';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import ServerListPresenter from 'in-new-components/lists/List/ServerListPresenter';
import getMobileApps from 'in-mobile-apps/subscriptions/getMobileApps';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import useTimeConfig from 'in-hooks/useTimeConfig';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ item, checkIfSelected, toggleItem }) {
      const isSelected = checkIfSelected(item.mobileApp.id);
      return <CheckboxFancy checked={isSelected} onChange={() => toggleItem(item.mobileApp.id, types.MOBILE_APP)} />;
    }
  },
  {
    getContent({ item }) {
      return item.mobileApp.label;
    }
  }
];

const ServerListWithUrlState = createServerTableWithUrlState({
  Renderer: ServerListPresenter,
  defaultOrderBy: 'mobileAppLabel',
  defaultPageSize: 10,
  pathSegment: '/mobileApps',
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
      onClick={item => toggleItem(item.mobileApp.id, types.MOBILE_APP)}
    />
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, query, timeConfig }) {
  return getMobileApps({
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
