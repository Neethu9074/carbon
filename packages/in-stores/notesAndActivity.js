/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createStore } from 'in-stores/store';

export const notesAndActivity = createStore({
  name: 'notesAndActivity',
  initialValue: false
});

export const notesAndActivity$ = notesAndActivity.observable.distinct();

export function setNotesAndActivity(metric) {
  notesAndActivity.applyStateMutation(() => metric);
}