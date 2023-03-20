/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { generateUniqueShortId } from '@instana/utils';
import { Button, SvgIcon } from '@instana/components';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-automation/ActionCatalog/ServerTablePresenterWrapper.mless';

export type ListItem<VALUETYPE> = { id: string; value: VALUETYPE };
interface ServerTablePresenterWrapperListItem {}

interface ServerTablePresenterWrapperListItemConfiguration<VALUETYPE>
  extends ServerTablePresenterWrapperListItem,
    ServerTablePresenterProps<ListItem<VALUETYPE>> {}

interface ServerTablePresenterWrapperProps<VALUETYPE>
  extends ServerTablePresenterWrapperListItem,
    Partial<ServerTablePresenterWrapperListItemConfiguration<VALUETYPE>> {
  columnDefinitions: ColumnDefinition<
    ListItem<VALUETYPE>,
    ServerTablePresenterWrapperListItemConfiguration<VALUETYPE>
  >[];
  data: ListItem<VALUETYPE>[];
  form: MapForm;
  formKey: string;
  defaultRow?: VALUETYPE;
  setForm: SetFormFunction;
  customAddRow?: () => void;
  customAddRowLabel?: string;
}

export default function ServerTablePresenterWrapper<VALUETYPE>({
  columnDefinitions,
  data,
  noDataMessage,
  leftHeader,
  form,
  formKey,
  defaultRow,
  setForm,
  customAddRow,
  customAddRowLabel
}: ServerTablePresenterWrapperProps<VALUETYPE>) {
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
  const deleteRowColumn = {
    id: 'deleteRow',
    width: '8',
    sortable: false,
    label: '',
    getContent(item: ListItem<VALUETYPE>) {
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
            <SvgIcon type="lib_actions_delete" className={locals.delete} onClick={() => deleteRow(item.id)} />
          </Tooltip>
        </div>
      );
    }
  };

  return (
    <ServerTablePresenter<ListItem<VALUETYPE>, ServerTablePresenterWrapperListItemConfiguration<VALUETYPE>>
      columnDefinitions={[...columnDefinitions, deleteRowColumn]}
      getRowProps={getRowProps}
      result={result}
      page={0}
      fixedLayout
      orderBy="id"
      orderDirection="ASC"
      pageSize={result?.data?.pageSize ?? 0}
      isSearchable={false}
      rightHeader={
        <Button kind="action" onClick={customAddRow ?? addRow} icon="lib_openclose_add_circle_outline">
          {customAddRowLabel ?? t('in-settings:tabs.addRow')}
        </Button>
      }
      noDataMessage={noDataMessage}
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
        return castedF.setValue([...value, { value: defaultRow!, id: generateUniqueShortId() }]).setTouched(false);
      })
    );
  }

  function deleteRow(id: string) {
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
  }
}
