/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item } from 'formalistic';

export function getValidationMessage(item: Item): string | undefined {
  const [validationMessage] = item.messages;
  if (validationMessage) return validationMessage.message;
  return undefined;
}

export function isFieldValid(field: Item): boolean {
  return field.valid || !field.touched;
}
