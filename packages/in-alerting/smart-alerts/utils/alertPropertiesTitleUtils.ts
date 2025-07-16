/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, Field } from 'formalistic';

import { HighlightedPlaceholders } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';

export function insertPlaceholderText(
  value: string,
  placeholderString: string,
  onChange: (path: string[], updater: (item: Item) => Item) => void
) {
  return () => {
    const textarea = document.getElementById('name') as HTMLTextAreaElement | null;

    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const tilSelectionStart = value.substring(0, selectionStart);
    const fromSelectionEnd = value.substring(selectionEnd);
    const newValue = tilSelectionStart + placeholderString + fromSelectionEnd;

    onChange(['name'], (field: Item) => (field as Field<string>).setValue(newValue).setTouched(true));

    setTimeout(() => {
      textarea.setSelectionRange(selectionStart + placeholderString.length, selectionStart + placeholderString.length);
      textarea.focus();
    }, 0);
  };
}

export function getTruncatedText(text: string | HighlightedPlaceholders, limit: number) {
  const textWithPlaceHolder = Array.isArray(text) ? text.join(' ') : text;
  const truncatedText =
    textWithPlaceHolder.length > limit ? textWithPlaceHolder.slice(0, limit) + '...' : textWithPlaceHolder;
  return truncatedText;
}
