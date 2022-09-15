/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable.mless';

export default function TagsTable({ columnDefinitions, result, addRow, deleteRow }) {
  return (
    <ServerTablePresenter
      columnDefinitions={columnDefinitions}
      getRowProps={getRowProps}
      result={result}
      isSearchable={false}
      rightHeader={<RightHeader addRow={addRow} />}
      noDataMessage={t('in-settings:tabs.noTagsConfigured')}
      deleteRow={deleteRow}
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
