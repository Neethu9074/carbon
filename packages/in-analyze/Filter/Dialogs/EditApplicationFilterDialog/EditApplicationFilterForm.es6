import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';

import locals from './EditApplicationFilterForm.mless';

export default function EditApplicationFilterForm({ form, onValueChanged }) {
  return (
    <div className={locals.editForm}>
      {form.get('name').map(field => {
        const parts = field.value.split('.');
        return (
          <FormGroup>
            <ol className={locals.keyList}>
              {parts.map(part => (
                <li key={part} className={locals.key}>
                  <Select className={locals.selectBox} id={part} value={part} onChange={() => {}} autoComplete="off">
                    <option key={part} value={part}>
                      {part}
                    </option>
                  </Select>
                </li>
              ))}
            </ol>
            <TouchedMessages field={field} />
          </FormGroup>
        );
      })}

      <div className={locals.keyValueSeperator}>:</div>

      {form.get('value').map(field => (
        <FormGroup className={locals.valueFormGroup}>
          <Input
            type="text"
            id="value"
            value={field.value}
            onChange={e => onValueChanged(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </div>
  );
}

export function getTagEditForm(name, value) {
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
