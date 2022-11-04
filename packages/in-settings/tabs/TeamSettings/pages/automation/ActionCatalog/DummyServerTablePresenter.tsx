/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Button } from '@instana/components';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { SetForm } from 'in-settings/tabs/TeamSettings/pages/automation/useEntityForm';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter.mless';

export type DeleteRow = (id: string) => void;
type ListItem<VALUETYPE> = { id: string; value: VALUETYPE };
interface DummyServerTablePresenterListItem {}

interface DummyServerTablePresenterListItemConfiguration<VALUETYPE>
  extends DummyServerTablePresenterListItem,
    ServerTablePresenterProps<ListItem<VALUETYPE>> {
  deleteRow: (id: string) => void;
}

interface DummyServerTablePresenterProps<VALUETYPE>
  extends DummyServerTablePresenterListItem,
    Partial<Omit<DummyServerTablePresenterListItemConfiguration<VALUETYPE>, 'deleteRow'>> {
  columnDefinitions: ColumnDefinition<ListItem<VALUETYPE>, DummyServerTablePresenterListItemConfiguration<VALUETYPE>>[];
  data: ListItem<VALUETYPE>[];
  form: MapForm;
  formKey: string;
  defaultRow: VALUETYPE;
  setForm: SetForm;
}

export default function DummyServerTablePresenter<VALUETYPE>({
  columnDefinitions,
  data,
  noDataMessage,
  leftHeader,
  form,
  formKey,
  defaultRow,
  setForm
}: DummyServerTablePresenterProps<VALUETYPE>) {
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

  const deleteRow: DeleteRow = function(id: string) {
    const rowIndex = (form.get(formKey) as Field<ListItem<VALUETYPE>[]>).value.reduce(
      (acc: number, item: ListItem<VALUETYPE>, i: number) => (item.id === id ? i : acc),
      -1
    );
    if (rowIndex >= 0) {
      setForm(
        form.updateIn([formKey], f => {
          const castedF = f as Field<ListItem<VALUETYPE>[]>;
          const value = [...castedF.value];
          value.splice(rowIndex, 1);
          return castedF.setValue(value).setTouched(true);
        })
      );
    }
  };

  return (
    <ServerTablePresenter<ListItem<VALUETYPE>, DummyServerTablePresenterListItemConfiguration<VALUETYPE>>
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

  function getRowProps() {
    return {
      className: locals.row,
      size: 'compact' as const
    };
  }

  function addRow() {
    setForm(
      form.updateIn([formKey], f => {
        const castedF = f as Field<ListItem<VALUETYPE>[]>;
        const value = castedF.value;
        return castedF.setValue([...value, { value: defaultRow, id: generateUniqueShortId() }]).setTouched(false);
      })
    );
  }
}
