/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field } from 'formalistic';
import React, { ChangeEvent } from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { OnEntityChange, SetFormFunction } from 'in-settings/hooks/useEntityForm';
import { ActionFormEntity } from 'in-automation/ActionCatalog/Action';
import Input from 'in-components/form/Input';

interface SimpleTagsTableProps {
  form: MapForm<any>;
  onChange: OnEntityChange<ActionFormEntity>;
  setForm: SetFormFunction;
}

export default function LabelsTable({ form, onChange, setForm }: SimpleTagsTableProps) {
  const labelsField = form.get('labels') as Field<string[]>;
  const labels = labelsField?.value || [];

  const handleInputChange = (index: number, value: string) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = value;
    updateFormState('labels', updatedLabels);
  };

  const handleAddLabel = () => {
    const updatedLabels = [...labels, ''];
    updateFormState('labels', updatedLabels);
  };

  const handleRemoveLabel = (index: number) => {
    const updatedLabels = [...labels];
    updatedLabels.splice(index, 1);
    updateFormState('labels', updatedLabels);
  };

  // This function updates the form state and also triggers the onChange handler
  const updateFormState = (key: string, value: string[]) => {
    setForm(
      form.updateIn([key], f => {
        const castedF = f as Field<string[]>;
        return castedF.setValue(value).setTouched(true);
      })
    );

    onChange(key, value);
  };

  return (
    <div>
      {labels.map((label, index) => (
        <div key={index}>
          <HorizontalFlexWrapper>
            <Input
              value={label}
              // onChange={e => onChange('name', e.target.value)}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, e.target.value)}
              maxLength={128}
            />
            <button onClick={() => handleRemoveLabel(index)}>Remove</button>
          </HorizontalFlexWrapper>
        </div>
      ))}
      <button onClick={handleAddLabel}>Add Label</button>
    </div>
  );
}
