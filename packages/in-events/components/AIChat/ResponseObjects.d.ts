/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

declare module 'in-events/components/AIChat/ResponseObjects' {
  export const promptLibrary: Array;
  export function ThumbsFeedbackObject(string, string): Object;
  export function NLGResponseObject(string): Object;
  export function TableChartObject(Array, Array): Object;
  export function EventsTableObject(Array, Array): Object;
}
