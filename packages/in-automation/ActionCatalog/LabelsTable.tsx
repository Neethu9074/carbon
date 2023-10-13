/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ChangeEvent, useContext } from 'react';
import { MapForm, Field } from 'formalistic';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import ServerTablePresenterWrapper from 'in-automation/ActionCatalog/ServerTablePresenterWrapper';
import { ActionFormEntity, isNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

import locals from './ServerTablePresenterWrapperConsumer.mless';

// import { generateUniqueShortId } from '@instana/utils';

// Adjust path if necessary

interface LabelsTableProps {
  form: MapForm<any>;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetFormFunction;
}

export interface Label {
  id: string;
  value: string;
}

const getColumnDefinitions = ({
  form,
  onChange,
  isNotEditable
}: Omit<LabelsTableProps, 'setForm'> & { isNotEditable: boolean }) => [
  {
    id: 'id',
    sortable: false,
    label: 'Labels',
    getContent(item: Label) {
      const labelsField = form.get('labels');
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
                  'labels',
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

export default function LabelsTable({ form, setForm, onChange }: LabelsTableProps) {
  const isNotEditable = useContext(isNotEditableContext);
  const columnDefinitions = getColumnDefinitions({ form, onChange, isNotEditable });
  const labels = (form.get('labels') as Field<any>).value;

  // const mappedLabels = labels.map(tag => ({ value: tag, id: generateUniqueShortId() }));

  return (
    <ServerTablePresenterWrapper
      columnDefinitions={columnDefinitions}
      data={labels}
      form={form}
      formKey="labels"
      customAddRowLabel="Add Label"
      defaultRow={''}
      setForm={setForm}
      noDataMessage={t('in-automation:ActionCatalog.noLabelsConfigured')}
    />
  );
}
