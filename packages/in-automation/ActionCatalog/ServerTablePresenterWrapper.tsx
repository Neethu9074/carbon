/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useContext } from 'react';
import { Field } from 'formalistic';
import classNames from 'classnames';

import { IconButton, Button } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { isNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { deepCopy } from 'in-services/util/object';
import { t } from 'in-i18n';

import locals from './ServerTablePresenterWrapper.mless';

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
  form: ActionForm;
  formKey: string;
  defaultRow?: VALUETYPE;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  customAddRow?: () => void;
  customAddRowLabel?: string;
  ticketIdParameterExist?: boolean;
  isEditable?: boolean;
}
const hasNameProperty = (obj: any): obj is { name: string } => obj && typeof obj.name === 'string';

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
  customAddRowLabel,
  ticketIdParameterExist = false,
  isEditable = true
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
      // we should not delete the id parameter for GH Action.
      const isTicketId = item.value && hasNameProperty(item.value) && item.value.name === 'id';
      const disabled = ticketIdParameterExist && isTicketId;
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
            <IconButton
              kind="primary"
              type="lib_actions_delete"
              className={classNames({
                [locals.delete]: true,
                [locals.disabled]: disabled
              })}
              onClick={() => !disabled && deleteRow(item.id)}
            />
          </Tooltip>
        </div>
      );
    }
  };
  const isNotEditableFromContext = useContext(isNotEditableContext);
  const isNotEditable = formKey !== 'tags' ? isNotEditableFromContext : !isEditable;
  const columnDefinitionsToShow = deepCopy(columnDefinitions);
  if (!isNotEditable) {
    columnDefinitionsToShow.push(deleteRowColumn);
  }

  return (
    <ServerTablePresenter<ListItem<VALUETYPE>, ServerTablePresenterWrapperListItemConfiguration<VALUETYPE>>
      columnDefinitions={columnDefinitionsToShow}
      getRowProps={getRowProps}
      result={result}
      page={0}
      fixedLayout
      orderBy="id"
      orderDirection="ASC"
      pageSize={result?.data?.pageSize ?? 0}
      isSearchable={false}
      rightHeader={
        !isNotEditable && (
          <Button kind="action" onClick={customAddRow ?? addRow} icon="lib_openclose_add_circle_outline">
            {customAddRowLabel ?? t('in-automation:ActionCatalog.addRow')}
          </Button>
        )
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
