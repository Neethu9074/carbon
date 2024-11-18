/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ChangeEvent, useContext } from 'react';
import { Field } from 'formalistic';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { isNotEditableContext, OnChange } from 'in-automation/ActionCatalog/Action';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ServerTablePresenterWrapperConsumer.mless';

interface AdditionalHeadersProps {
  form: ActionForm;
  onChange: OnChange;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}

export interface Header {
  id: string;
  value: string[];
}

const getColumnDefinitions = ({
  form,
  onChange,
  isNotEditable
}: Omit<AdditionalHeadersProps, 'setForm'> & { isNotEditable: boolean }) => [
  {
    id: 'key',
    sortable: false,
    size: '2',
    label: t('in-automation:ActionCatalog.key'),
    getContent(item: Header) {
      const field = form.get('additionalHeaders');
      return (
        <>
          <HorizontalFlexWrapper className={locals.colName}>
            <Input
              className={locals.key}
              value={item.value[0]}
              disabled={isNotEditable}
              hasError={!field?.valid && field?.touched && item.value[0] === ''}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                // TODO: this needs investigation and adoption for case of [...undefined]
                // eslint-disable-next-line no-unsafe-optional-chaining
                const additionalHeaders = [...(field as Field<Header[]>)?.value];
                const index = additionalHeaders.findIndex(header => header?.id === item.id);
                additionalHeaders[index] = { id: item.id, value: [target.value, additionalHeaders[index].value[1]] };
                onChange('additionalHeaders', additionalHeaders);
              }}
              maxLength={128}
            />
          </HorizontalFlexWrapper>
          {item.value[0] === '' && <TouchedMessages field={field} />}
        </>
      );
    }
  },
  {
    id: 'value',
    sortable: false,
    size: '2',
    label: t('in-automation:value'),
    getContent(item: Header) {
      const field = form.get('additionalHeaders');
      return (
        <>
          <HorizontalFlexWrapper className={locals.colName}>
            <Input
              className={locals.key}
              value={item.value[1]}
              disabled={isNotEditable}
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
        </>
      );
    }
  }
];
export default function AdditionalHeadersTable({ form, setForm, onChange }: AdditionalHeadersProps) {
  const isNotEditable = useContext(isNotEditableContext);
  const columnDefinitions = getColumnDefinitions({ form, onChange, isNotEditable });
  const field = form.get('additionalHeaders') as Field<Header[]>;
  const additionalHeaders = field.value;

  return (
    <ServerTablePresenterWrapper
      columnDefinitions={columnDefinitions}
      data={additionalHeaders}
      form={form}
      formKey="additionalHeaders"
      defaultRow={['', '']}
      setForm={setForm}
      noDataMessage={t('in-automation:ActionCatalog.noAdditionalHeadersConfigured')}
      leftHeader={
        <Label htmlFor="action-contentType" hasError={!field.valid && field.touched}>
          {t('in-automation:ActionCatalog.additionalHeadersOptional')}
        </Label>
      }
    />
  );
}
