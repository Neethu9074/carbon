/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { IconButton, Button } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { ActionForm, MappedValue } from 'in-automation/ActionCatalog/useActionForm/types';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { t } from 'in-i18n';

import locals from './ServerTablePresenterWrapper.mless';

interface ServerTablePresenterWrapperProps<VALUETYPE> {
  columnDefinitions: ColumnDefinition<MappedValue<VALUETYPE>>[];
  formKey: 'additionalHeaders' | 'assignees' | 'labels' | 'parameters';
  defaultRow?: VALUETYPE;
  customAddRow?: () => void;
  customAddRowLabel?: string;
  ticketIdParameterExist?: boolean;
  noDataMessage?: string;
  leftHeader?: React.ReactNode;
}

export default function ServerTablePresenterWrapper<VALUETYPE>({
  columnDefinitions,
  noDataMessage,
  leftHeader,
  formKey,
  defaultRow,
  customAddRow,
  customAddRowLabel,
  ticketIdParameterExist = false
}: ServerTablePresenterWrapperProps<VALUETYPE>) {
  const isNotEditable = useIsNotEditableContext();
  const { form, setForm } = useActionFormContext();
  const data = form.get(formKey).value as MappedValue<VALUETYPE>[];
  const result = {
    // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
    progress: {
      loading: false
    },
    errors: [],
    data: {
      items: data ?? [],
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
    getContent(item: MappedValue<VALUETYPE>) {
      const isTicketId = item.value instanceof Object && 'name' in item.value && item.value.name === 'id';
      const disabled = ticketIdParameterExist && isTicketId;
      return (
        <div className={locals.controls}>
          <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
            <IconButton
              kind="primary"
              disabled={disabled}
              type="lib_actions_delete"
              className={locals.delete}
              onClick={() => !disabled && deleteRow(item.id)}
            />
          </Tooltip>
        </div>
      );
    }
  };

  const columnDefinitionsToShow = [...columnDefinitions];
  if (!isNotEditable) {
    columnDefinitionsToShow.push(deleteRowColumn);
  }

  return (
    <ServerTablePresenter<MappedValue<VALUETYPE>, ServerTablePresenterProps<MappedValue<VALUETYPE>>>
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
      form =>
        form.updateIn([formKey], item => {
          const value: any = item.value;
          return item.setValue([...value, { value: defaultRow!, id: generateUniqueShortId() }]).setTouched(false);
        }) as ActionForm
    );
  }

  function deleteRow(id: string) {
    const rowIndex = form.get(formKey).value.findIndex(item => item.id === id);
    if (rowIndex >= 0) {
      setForm(
        form =>
          form.updateIn([formKey], item => {
            const value: any = [...item.value];
            value.splice(rowIndex, 1);
            return item.setValue(value).setTouched(true);
          }) as ActionForm
      );
    }
  }
}
