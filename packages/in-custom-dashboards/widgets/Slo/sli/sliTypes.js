/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export const applicationType = 'application';
export const availabilityType = 'availability';

export const sliTypeOptions = Object.freeze([
  { value: applicationType, label: 'Time-based' },
  { value: availabilityType, label: 'Event-based' }
]);
