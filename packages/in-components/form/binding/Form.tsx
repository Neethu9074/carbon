/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { FormEvent } from 'react';
import { Item } from 'formalistic';

import { Form as BaseForm } from '@instana/components';

import { FormContext } from 'in-components/form/binding/FormContext';

interface FormProps {
  onSubmit: (form: Item) => void;
  children: React.ReactNode;
  form: Item;
  setForm: (form: Item) => void;
  formId?: string;
  disabled?: boolean;
  'aria-label'?: string;
}

export default function Form({
  onSubmit,
  children,
  form,
  setForm,
  disabled,
  formId,
  'aria-label': ariaLabel
}: FormProps) {
  return (
    <FormContext.Provider
      value={{
        form,
        rootPath: [],
        setForm,
        disabled
      }}
    >
      <BaseForm
        id={formId}
        aria-label={ariaLabel}
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          event.stopPropagation();

          if (!form.hierarchyValid) {
            setForm(form.setTouched(true, { recurse: true }));
            return;
          }

          onSubmit(form);
        }}
      >
        {children}
      </BaseForm>
    </FormContext.Provider>
  );
}
