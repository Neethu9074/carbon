/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationMessage, MapForm } from 'formalistic';
import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

interface CategorizedValidationMessage extends ValidationMessage {
  category: string;
}

export function hasErrorOfCategory(form: MapForm<any>, category: string): boolean {
  return !form?.valid && form?.messages?.filter(filterByCategory(category)).length > 0;
}

function filterByCategory(category: string): (message: ValidationMessage) => boolean {
  return message => !category || (isCategorized(message) && message?.category === category);
}

function isCategorized(message: ValidationMessage): message is CategorizedValidationMessage {
  return !!(message as CategorizedValidationMessage)?.category;
}

interface ValidationMessagesProps {
  form: MapForm<any>;
  category: string;
}

/**
 * Renders all validation error messages of a form of a specific category.
 * It does not show any path info of any message.
 *
 * @param form formalistic form
 * @param category only messages of this category are shown, or all if it is not defined
 * @returns {null|[ValidationBlock]}
 */
export default function ValidationMessages({ form, category }: ValidationMessagesProps) {
  if (!form?.hierarchyTouched) {
    return null;
  }

  /*
   Wrapping it into a fragment, to avoid this TS error
   TS2786: Its return type 'Element[]' is not a valid JSX element.
   */
  return (
    <>
      {form.messages.filter(filterByCategory(category)).map((message, i) => {
        return <ValidationBlock key={i}>{message.message}</ValidationBlock>;
      })}
    </>
  );
}
