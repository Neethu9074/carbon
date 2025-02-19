/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/CreateNewActionTearsheet';
import { ActionForm, MappedString } from 'in-automation/ActionCatalog/useActionForm/types';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import Input from 'in-components/form/Input/Input';

const getColumnDefinitions = ({
  form,
  setForm,
  isNotEditable,
  fieldName,
  label
}: {
  form: ActionForm;
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  isNotEditable: boolean;
  fieldName: 'labels' | 'assignees';
  label: string;
}): ColumnDefinition<MappedString>[] => [
  {
    id: 'value',
    sortable: false,
    label: label ?? 'labels',
    getContent(item) {
      const labelsField = form.get(fieldName);
      return (
        <>
          <HorizontalFlexWrapper>
            <Input
              value={item.value}
              disabled={isNotEditable}
              hasError={!labelsField.valid && labelsField.touched && item.value === ''}
              onChange={e => {
                const updatedLabes = labelsField.value.map(label =>
                  label.id === item.id
                    ? {
                        id: label.id,
                        value: e.target.value
                      }
                    : label
                );

                setForm(form => form.updateIn([fieldName], item => item.setValue(updatedLabes).setTouched(true)));
              }}
              maxLength={128}
            />
          </HorizontalFlexWrapper>
          {item.value === '' && <TouchedMessages field={labelsField} />}
        </>
      );
    }
  }
];

interface FieldsTableProps {
  fieldName?: 'labels' | 'assignees';
  customAddRowLabel: string;
  label: string;
  noDataMessage: string;
}

export default function FieldsTable({
  fieldName = 'labels',
  customAddRowLabel,
  label,
  noDataMessage
}: FieldsTableProps) {
  const { form, setForm } = useActionFormContext();
  const isNotEditable = useIsNotEditableContext();

  const columnDefinitions = getColumnDefinitions({ form, setForm, isNotEditable, fieldName, label });

  return (
    <ServerTablePresenterWrapper
      columnDefinitions={columnDefinitions}
      formKey={fieldName}
      customAddRowLabel={customAddRowLabel}
      defaultRow={''}
      noDataMessage={noDataMessage}
    />
  );
}
