/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ChangeEvent, useContext } from 'react';
import { Field } from 'formalistic';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { isNotEditableContext, OnChange } from 'in-automation/ActionCatalog/Action';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { ActionForm } from 'in-automation/ActionCatalog/useActionForm';
import Input from 'in-components/form/Input/Input';

import locals from './ServerTablePresenterWrapperConsumer.mless';

export interface Label {
  id: string;
  value: string;
}

interface LabelsTableProps {
  form: ActionForm;
  onChange: OnChange;
  fieldName?: string;
  label: string;
}

interface FieldProps extends LabelsTableProps {
  setForm: React.Dispatch<React.SetStateAction<ActionForm>>;
  customAddRowLabel: string;
  noDataMessage: string;
}

const getColumnDefinitions = ({
  form,
  onChange,
  isNotEditable,
  fieldName,
  label
}: LabelsTableProps & { isNotEditable: boolean }) => [
  {
    id: 'value',
    sortable: false,
    label: label ?? 'labels',
    getContent(item: Label) {
      const labelsField = form.get(`${fieldName}`);
      return (
        <>
          <HorizontalFlexWrapper className={locals.colName}>
            <Input
              className={locals.key}
              value={item.value}
              disabled={isNotEditable}
              hasError={!labelsField?.valid && labelsField?.touched && item.value === ''}
              onChange={({ target }: ChangeEvent<HTMLInputElement>) => {
                const labels = (labelsField as Field<Label[]>)?.value;
                onChange(
                  `${fieldName}`,
                  labels.map(label =>
                    label?.id === item.id
                      ? {
                          id: label.id,
                          value: target.value
                        }
                      : label
                  )
                );
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

export default function FieldsTable({
  form,
  setForm,
  onChange,
  fieldName = 'labels',
  customAddRowLabel,
  label,
  noDataMessage
}: FieldProps) {
  const isNotEditable = useContext(isNotEditableContext);
  const columnDefinitions = getColumnDefinitions({ form, onChange, isNotEditable, fieldName, label });
  const labels = (form.get(`${fieldName}`) as Field<any>).value;

  return (
    <ServerTablePresenterWrapper
      columnDefinitions={columnDefinitions}
      data={labels}
      form={form}
      formKey={fieldName}
      customAddRowLabel={customAddRowLabel}
      defaultRow={''}
      setForm={setForm}
      noDataMessage={noDataMessage}
    />
  );
}
