/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import PromptPresenter from 'in-components/Dialog/PromptPresenter';
import { notBlankValidator } from 'in-services/validators/string';

function getInitialState(initialValue) {
  return createField({
    value: initialValue ?? '',
    validator: notBlankValidator
  });
}

export default function Prompt(props) {
  const { initialValue, onSubmit } = props;
  const [field, setField] = useState(() => getInitialState(initialValue));
  useEffect(() => {
    setField(getInitialState(initialValue));
  }, [initialValue]);

  return (
    <PromptPresenter
      {...props}
      field={field}
      setField={setField}
      onChange={v => setField(field.setValue(v).setTouched(true))}
      onSubmit={() => {
        if (!field.valid) {
          setField(field.setTouched(true));
          return;
        }

        onSubmit(field.value);
      }}
    />
  );
}
