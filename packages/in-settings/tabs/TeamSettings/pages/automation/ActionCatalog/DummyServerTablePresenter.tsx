/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Button } from '@instana/components';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter.mless';

interface DummyServerTablePresenterListItem {
  deleteRow: (id: string) => void;
}

interface DummyServerTablePresenterListItemConfiguration<ListItem extends Object>
  extends DummyServerTablePresenterListItem,
    ServerTablePresenterProps<ListItem> {}

interface DummyServerTablePresenterProps<ListItem extends Object>
  extends DummyServerTablePresenterListItem,
    Partial<Omit<DummyServerTablePresenterListItemConfiguration<ListItem>, 'deleteRow'>> {
  columnDefinitions: ColumnDefinition<ListItem, DummyServerTablePresenterListItemConfiguration<ListItem>>[];
  addRow: () => void;
  data: ListItem[];
}

export default function DummyServerTablePresenter<ListItem extends Object>({
  columnDefinitions,
  data,
  addRow,
  deleteRow,
  noDataMessage,
  leftHeader
}: DummyServerTablePresenterProps<ListItem>) {
  const result = {
    // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: data ?? [],
      // Show all tags
      page: 1,
      pageSize: data?.length ?? 0,
      totalHits: data?.length ?? 0
    }
  };
  return (
    <ServerTablePresenter<ListItem, DummyServerTablePresenterListItemConfiguration<ListItem>>
      columnDefinitions={columnDefinitions}
      getRowProps={getRowProps}
      result={result}
      page={0}
      orderBy="id"
      orderDirection="ASC"
      pageSize={result?.data?.pageSize ?? 0}
      isSearchable={false}
      rightHeader={
        <Button kind="action" onClick={addRow} icon="lib_openclose_add_circle_outline">
          {t('in-settings:tabs.addRow')}
        </Button>
      }
      noDataMessage={noDataMessage}
      deleteRow={deleteRow}
      leftHeader={leftHeader}
    />
  );
}

function getRowProps() {
  return {
    className: locals.row,
    size: 'compact' as const
  };
}
