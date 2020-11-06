import PropTypes from 'prop-types';
import React from 'react';

import { pathPropType } from 'in-components/form/binding/paths';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormBound from 'in-components/form/binding/FormBound';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function FormBoundInput({ path, autoHide, label, ...props }) {
  return (
    <FormBound path={path} autoHide={autoHide}>
      {({ pathId, item: field, form, setForm, absolutePath, disabled }) => (
        <FormGroup>
          <Label htmlFor={pathId} hasError={!field.valid && field.touched}>
            {label}
          </Label>
          <Input
            id={pathId}
            value={field.value}
            onChange={event => {
              // Deliberately accessing type via props.type so that this
              // value also gets forwarded to <Input />
              const value = props.type === 'number' ? event.target.valueAsNumber : event.target.value;
              const updatedForm = form.updateIn(absolutePath, field => {
                return field.setValue(value).setTouched(true);
              });
              setForm(updatedForm);
            }}
            {...props}
            hasError={!field.valid && field.touched}
            disabled={disabled}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      )}
    </FormBound>
  );
}

FormBoundInput.propTypes = {
  path: pathPropType.isRequired,
  autoHide: PropTypes.bool,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};
