/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import { Field } from 'formalistic';

import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import TextArea from 'in-components/form/TextArea/TextArea';

import locals from './AlertPropertiesTextArea.mless';

interface AlertPropertiesTextareaProps {
  name: string;
  id: string;
  rows?: string;
  onChange: (arg: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  formField: Field<string>;
}

const AlertPropertiesTextarea = forwardRef(function AlertPropertiesTextarea(
  { formField, ...remainingProps }: AlertPropertiesTextareaProps,
  ref
) {
  return (
    <FormGroup>
      <TextArea
        {...remainingProps}
        hasError={hasFieldError(formField)}
        className={locals.textArea}
        value={formField?.value}
        ref={ref as React.MutableRefObject<HTMLTextAreaElement>}
      />
      <TouchedMessages field={formField} />
    </FormGroup>
  );
});

function hasFieldError(field: Field<string>): boolean {
  return field && !field?.valid && field?.touched;
}

export default AlertPropertiesTextarea;
