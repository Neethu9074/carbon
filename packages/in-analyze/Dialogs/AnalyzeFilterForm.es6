import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FilterConnector from 'in-analyze/Filter/FilterConnector';
import { joinClassNames } from 'in-services/util/classnames';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input/Input';
import Select from 'in-components/form/Select';

import locals from './AnalyzeFilterForm.mless';

export default function AnalyzeFilterForm({ children }) {
  return <div className={locals.editForm}>{children}</div>;
}

export function KeyListGroup({ field, children }) {
  return (
    <FormGroup>
      <ol className={locals.keyList}>{children}</ol>
      <TouchedMessages field={field} />
    </FormGroup>
  );
}

export function KeyPart({ children }) {
  return <li className={locals.key}>{children}</li>;
}

export function SelectBox({ children, id, value, onChange }) {
  return (
    <Select className={locals.selectBox} id={id} value={value} onChange={onChange} autoComplete="off">
      {children}
    </Select>
  );
}

export function FieldSeperator({ children }) {
  return <FilterConnector className={locals.fieldSeperator}>{children}</FilterConnector>;
}

export function ValueGroup({ className, field, children }) {
  return (
    <FormGroup className={joinClassNames(locals.valueFormGroup, className)}>
      {children}
      <TouchedMessages field={field} />
    </FormGroup>
  );
}

export function AutoCompletedSelect({ field, onValueChanged, autoCompletedOptions }) {
  let isValueInsideOptions = false;
  if (field.value) {
    for (let i = 0; i < autoCompletedOptions.length; i++) {
      const option = autoCompletedOptions[i];
      if (option.value === field.value) {
        isValueInsideOptions = true;
        break;
      }
    }
  } else {
    isValueInsideOptions = true;
  }

  if (!isValueInsideOptions) {
    autoCompletedOptions = [{ label: field.value, value: field.value }].concat(autoCompletedOptions);
  }

  return (
    <CreatableSelect
      id="value"
      value={field.value}
      onChange={e => onValueChanged(e ? e.value : '')}
      options={autoCompletedOptions}
      placeholder=""
      isClearable
      autoFocus
      searchable
    />
  );
}

export function FixedSelection({ value }) {
  return <Input className={locals.fixedValue} id={value} value={value} autoComplete="off" disabled />;
}

export function getInitialForm(name, value) {
  return createMapForm()
    .put(
      'name',
      createField({
        value: name
      })
    )
    .put(
      'value',
      createField({
        value: value,
        validator: notBlankValidator
      })
    );
}
