import { skipOnboardingDialog } from 'in-services/featureFlags';

export default function checkIfUserCanPass(firstKnownReportingTime) {
  if (skipOnboardingDialog) {
    return true;
  }
  return firstKnownReportingTime > 0;
}
