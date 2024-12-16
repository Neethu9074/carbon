/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { skipOnboardingDialog } from 'in-services/featureFlags';

export default function checkIfUserCanPass(hasEntities: boolean | undefined): boolean | undefined {
  if (skipOnboardingDialog) {
    return true;
  }
  return hasEntities;
}
