/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import { createStore } from 'in-stores/store';

// This store is currently used in `NotesAndActivity.js` to control
// the opening and closing of the notes side panel as well as
// if we should trigger a ai summary generation.
const summaryNotesStore = createStore({
  name: 'summaryNotes',
  initialValue: {
    open: false,
    generateAISummary: false,
    summaryLoading: false
  }
});

export const summaryNotes = summaryNotesStore.observable;
export const summaryNotes$ = summaryNotes;

export function setSummaryNotes(open: boolean, generateAISummary: boolean, summaryLoading: boolean) {
  const newValue = {
    open: open,
    generateAISummary: generateAISummary,
    summaryLoading: summaryLoading
  };
  summaryNotesStore.applyStateMutation(() => newValue);
}
