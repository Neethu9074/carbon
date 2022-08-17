/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable.mless';

export default function TagsTable({ columnDefinitions, result, addRow, deleteRow, noDataMessage, leftHeader }) {
  return (
    <ServerTablePresenter
      columnDefinitions={columnDefinitions}
      getRowProps={getRowProps}
      result={result}
      isSearchable={false}
      rightHeader={<RightHeader addRow={addRow} />}
      noDataMessage={noDataMessage}
      deleteRow={deleteRow}
      leftHeader={leftHeader}
    />
  );
}

function RightHeader({ addRow }) {
  return (
    <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline">
      {t('in-settings:tabs.addRow')}
    </Button>
  );
}

function getRowProps() {
  return {
    className: locals.row,
    size: 'compact'
  };
}
