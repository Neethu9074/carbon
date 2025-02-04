/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './CopyablbeText.mless';

interface CopyableTextProps<FORM_ITEMS extends Record<string, Field<any>>> {
  fieldName: keyof FORM_ITEMS;
  form: MapForm<FORM_ITEMS>;
  title: string;
}

export default function CopyableText<FORM_ITEMS extends Record<string, Field<any>>>({
  title,
  form,
  fieldName
}: CopyableTextProps<FORM_ITEMS>) {
  const field = form.get(fieldName);
  return (
    <FormGroup>
      <Label htmlFor={fieldName} hasError={!field.valid && field.touched}>
        {title}
      </Label>

      <div className={locals.flexWrapper}>
        <Input
          className={locals.input}
          readOnly
          type="text"
          id={fieldName.toString()}
          value={field.value}
          autoComplete="off"
        />
        <CopyToClipboardButton size="compact" getText={() => field.value} />
      </div>
    </FormGroup>
  );
}
