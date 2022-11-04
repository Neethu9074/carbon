/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';
import React, { ChangeEvent } from 'react';

import { SvgIcon } from '@instana/components';

import DummyServerTablePresenter from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/DummyServerTablePresenter';
import { ActionFormEntity } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/Action';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { OnChange, SetForm } from 'in-settings/tabs/TeamSettings/pages/automation/useEntityForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './DummyServerTablePresenterConsumer.mless';

interface AdditionalHeadersProps {
  form: MapForm;
  onChange: OnChange<ActionFormEntity>;
  setForm: SetForm;
}

export interface Header {
  id: string;
  value: string[];
}

const getColumnDefinitions = ({ form, onChange }: Omit<AdditionalHeadersProps, 'setForm'>) => [
  {
    id: 'key',
    sortable: false,
    size: '2',
    label: t('in-settings:tabs.key'),
    getContent(item: Header) {
      const field = form.get('additionalHeaders');
      return (
        <FormGroup>
          <HorizontalFlexWrapper className={locals.colName}>
            <Input
              className={locals.key}
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
          <HorizontalFlexWrapper className={locals.colName}>
            <Input
              className={locals.key}
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
        <div className={locals.controls}>
          <Tooltip content={t('in-alerting:components.customPayload.deleteRow')}>
            <SvgIcon type="lib_actions_delete" className={locals.delete} onClick={() => deleteRow(item.id)} />
          </Tooltip>
        </div>
      );
    }
  }
];
export default function AdditionalHeadersTable({ form, setForm, onChange }: AdditionalHeadersProps) {
  const columnDefinitions = getColumnDefinitions({ form, onChange });
  const field = form.get('additionalHeaders') as Field<Header[]>;
  const additionalHeaders = field.value;

  return (
    <DummyServerTablePresenter
      columnDefinitions={columnDefinitions}
      data={additionalHeaders}
      form={form}
      formKey="additionalHeaders"
      defaultRow={['', '']}
      setForm={setForm}
      noDataMessage={t('in-settings:tabs.noAdditionalHeadersConfigured')}
      leftHeader={
        <Label htmlFor="action-contentType" hasError={!field.valid && field.touched}>
          {t('in-settings:tabs.additionalHeadersOptional')}
        </Label>
      }
    />
  );
}
