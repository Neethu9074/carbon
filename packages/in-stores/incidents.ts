/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { createStore } from 'in-stores/store';

const summaryNotesStore = createStore({
  name: 'summaryNotes',
  initialValue: {
    open: false,
    generateAISummary: false
  }
});

export const summaryNotes = summaryNotesStore.observable;
export const summaryNotes$ = summaryNotes;

export function setSummaryNotes(open: boolean, generateAISummary: boolean) {
  const newValue = {
    open: open,
    generateAISummary: generateAISummary
  };
  summaryNotesStore.applyStateMutation(() => newValue);
}
