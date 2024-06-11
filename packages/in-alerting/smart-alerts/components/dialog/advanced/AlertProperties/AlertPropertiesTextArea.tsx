/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import { Field } from 'formalistic';

import { TextArea } from '@instana/components';

import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';

import locals from './AlertPropertiesTextArea.mless';

interface AlertPropertiesTextareaProps {
  name: string;
  id: string;
  rows?: number;
  onChange: (arg: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  formField: Field<string>;
  isTearSheet?: boolean;
}

const AlertPropertiesTextarea = forwardRef(function AlertPropertiesTextarea(
  { formField, isTearSheet, ...remainingProps }: AlertPropertiesTextareaProps,
  ref
) {
  return (
    <>
      {isTearSheet ? (
        <>
          <TextArea
            {...remainingProps}
            hasError={hasFieldError(formField)}
            className={locals.textArea}
            value={formField?.value}
            ref={ref as React.MutableRefObject<HTMLTextAreaElement>}
            rows={1}
          />
          <TouchedMessages field={formField} />
        </>
      ) : (
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
      )}
    </>
  );
});

function hasFieldError(field: Field<string>): boolean {
  return field && !field?.valid && field?.touched;
}

export default AlertPropertiesTextarea;
