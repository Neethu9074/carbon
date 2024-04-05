/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export function getLicenseTypeForSegment(currentActiveLicense: string) {
  switch (currentActiveLicense) {
    case 'selfService':
      return 'trial';
    case 'quota':
      return 'POC';
    case 'free_not_for_resale':
      return 'NFR';
    case 'paidPerUse':
    case 'hostBasedPaid':
      return 'subscription';
    case 'paid-paygo':
      return 'paygo';
    default:
      return currentActiveLicense;
  }
}
