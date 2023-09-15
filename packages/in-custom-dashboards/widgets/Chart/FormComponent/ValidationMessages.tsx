/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationMessage, Field, MapForm } from "formalistic";
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
  field: Field<any>;
  category: string;
}

/**
 * Renders all validation error messages of a form of a specific category.
 * It does not show any path info of any message.
 *
 * @param field formalistic field
 * @param category only messages of this category are shown, or all if it is not defined
 * @returns {null|[ValidationBlock]}
 */
export default function ValidationMessages({ field, category }: ValidationMessagesProps) {
  if (!field?.hierarchyTouched) {
    return null;
  }

  return field.messages.filter(filterByCategory(category)).map((message, i) => {
    return <ValidationBlock key={i}>{message.message}</ValidationBlock>;
  });
}

