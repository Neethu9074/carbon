/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { SetStateAction, ChangeEvent } from 'react';
import { Field, MapForm } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';
import { SvgIcon } from '@instana/components';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import DummyServerTablePresenter from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals2 from './TagsTable.mless';

interface AdditionalHeadersProps {
  form: MapForm;
  onChange: Function;
  setForm: (form: MapForm) => SetStateAction<MapForm>;
  field: Field<Header[]>;
}

export interface Header {
  id: string;
  value: string[];
}

export default function AdditionalHeadersTable({ form, setForm, onChange, field }: AdditionalHeadersProps) {
  const tableColumnDefinitions = [
    {
      id: 'key',
      sortable: false,
      size: '2',
      label: t('in-settings:tabs.key'),
      getContent(item: Header) {
        const field = form.get('additionalHeaders');
        return (
          <FormGroup>
            <HorizontalFlexWrapper className={locals2.colName}>
              <Input
                className={locals2.key}
                value={item.value[0]}
                hasError={!field?.valid && field?.touched && item.value[0] === ''}
                onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                  const additionalHeaders = [...(field as Field<Header[]>)?.value];
                  const index = additionalHeaders.findIndex(header => header?.id === item.id);
                  additionalHeaders[index] = { id: item.id, value: [target.value, additionalHeaders[index].value[1]] };
                  onChange('additionalHeaders', additionalHeaders);
                }}
                maxLength={128}
              />
            </HorizontalFlexWrapper>
            {item.value[0] === '' && <TouchedMessages field={field} />}
          </FormGroup>
        );
      }
    },
    {
      id: 'value',
      sortable: false,
      size: '2',
      label: t('in-settings:tabs.value'),
      getContent(item: Header) {
        const field = form.get('additionalHeaders');
        return (
          <FormGroup>
            <HorizontalFlexWrapper className={locals2.colName}>
              <Input
                className={locals2.key}
                value={item.value[1]}
                hasError={!field?.valid && field?.touched && item.value[1] === ''}
                onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                  const additionalHeaders = [...(field as Field<Header[]>).value];
                  const index = additionalHeaders.findIndex(header => header?.id === item.id);
                  additionalHeaders[index] = { id: item.id, value: [additionalHeaders[index].value[0], target.value] };
                  onChange('additionalHeaders', additionalHeaders);
                }}
                maxLength={128}
              />
            </HorizontalFlexWrapper>
            {item.value[1] === '' && <TouchedMessages field={field} />}
          </FormGroup>
        );
      }
    },
    {
      id: 'deleteRow',
      width: '5',
      sortable: false,
      label: '',
      getContent(item: Header, { deleteRow }: { deleteRow: Function }) {
        return (
          <div className={locals2.controls}>
            <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
              <SvgIcon type="lib_actions_delete" className={locals2.delete} onClick={() => deleteRow(item.id)} />
            </Tooltip>
          </div>
        );
      }
    }
  ];
  const additionalHeaders = (form.get('additionalHeaders') as Field<Header[]>)?.value;

  return (
    <DummyServerTablePresenter<Header>
      columnDefinitions={tableColumnDefinitions}
      addRow={addRow}
      deleteRow={deleteRow}
      data={additionalHeaders}
      noDataMessage={t('in-settings:tabs.noAdditionalHeadersConfigured')}
      leftHeader={
        <Label htmlFor="action-contentType" hasError={!field.valid && field.touched}>
          {t('in-settings:tabs.additionalHeadersOptional')}
        </Label>
      }
    />
  );

  function deleteRow(id: string) {
    const rowIndex = form
      ?.get('additionalHeaders')
      ?.toJS()
      .reduce((acc: number, item: Header, i: number) => (item.id === id ? i : acc), -1);
    if (rowIndex >= 0) {
      setForm(
        form.updateIn(['additionalHeaders'], f => {
          const castedF = f as Field<Header[]>;
          const value = [...castedF.value];
          value.splice(rowIndex, 1);
          return castedF.setValue(value).setTouched(true);
        })
      );
    }
  }

  function addRow() {
    setForm(
      form.updateIn(['additionalHeaders'], f => {
        const castedF = f as Field<Header[]>;
        const value = castedF.value;
        return castedF.setValue([...value, { value: ['', ''], id: generateUniqueShortId() }]).setTouched(false);
      })
    );
  }
}
