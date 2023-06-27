/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export function getOverallStatus(rating: string): string {
  switch (rating) {
    case 'Red':
      return 'Critical';
    case 'Green':
      return 'Okay';
    case 'Yellow':
      return 'Warning';
    default:
      return rating;
  }
}
