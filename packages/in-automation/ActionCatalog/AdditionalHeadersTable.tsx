/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { ActionForm, MappedHeader } from 'in-automation/ActionCatalog/useActionForm/types';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

const getColumnDefinitions = ({
  form,
  setForm,
  isNotEditable
}: {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  isNotEditable: boolean;
}): ColumnDefinition<MappedHeader>[] => [
  {
    id: 'key',
    sortable: false,
    label: t('in-automation:ActionCatalog.key'),
    getContent(item) {
      const field = form.get('additionalHeaders');
      return (
        <>
          <HorizontalFlexWrapper>
            <Input
              value={item.value[0]}
              disabled={isNotEditable}
              hasError={!field?.valid && field?.touched && item.value[0] === ''}
              onChange={e => {
                const updatedAdditionalHeaders = [...field.value];
                const index = updatedAdditionalHeaders.findIndex(header => header?.id === item.id);
                updatedAdditionalHeaders[index] = {
                  id: item.id,
                  value: [e.target.value, updatedAdditionalHeaders[index].value[1]]
                };
                setForm(form =>
                  form.updateIn(['additionalHeaders'], item => item.setValue(updatedAdditionalHeaders).setTouched(true))
                );
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
    label: t('in-automation:value'),
    getContent(item) {
      const field = form.get('additionalHeaders');
      return (
        <>
          <HorizontalFlexWrapper>
            <Input
              value={item.value[1]}
              disabled={isNotEditable}
              hasError={!field?.valid && field?.touched && item.value[1] === ''}
              onChange={e => {
                const updatedAdditionalHeaders = [...field.value];
                const index = updatedAdditionalHeaders.findIndex(header => header?.id === item.id);
                updatedAdditionalHeaders[index] = {
                  id: item.id,
                  value: [updatedAdditionalHeaders[index].value[0], e.target.value]
                };
                setForm(form =>
                  form.updateIn(['additionalHeaders'], item => item.setValue(updatedAdditionalHeaders).setTouched(true))
                );
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

interface AdditionalHeadersProps {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
}

export default function AdditionalHeadersTable({ form, setForm }: AdditionalHeadersProps) {
  const isNotEditable = useIsNotEditableContext();
  const columnDefinitions = getColumnDefinitions({ form, setForm, isNotEditable });
  const field = form.get('additionalHeaders');

  return (
    <ServerTablePresenterWrapper
      columnDefinitions={columnDefinitions}
      formKey="additionalHeaders"
      defaultRow={['', '']}
      noDataMessage={t('in-automation:ActionCatalog.noAdditionalHeadersConfigured')}
      leftHeader={
        <Label htmlFor="action-contentType" hasError={!field.valid && field.touched}>
          {t('in-automation:ActionCatalog.additionalHeadersOptional')}
        </Label>
      }
    />
  );
}
