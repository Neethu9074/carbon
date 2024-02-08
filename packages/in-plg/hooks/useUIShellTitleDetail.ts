/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useObservable } from '@instana/hooks';

import { playwithEnabled, playWithReleaseEnabled } from 'in-services/featureFlags';
import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import { t } from 'in-i18n';

export default function useUIShellTitleDetail(): string {
  const messages = useObservable(messages$, []) ?? [];
  const firstLicenseUsageMsg = messages.find(message => message.isLicenseUsageMsg);

  if (playwithEnabled || playWithReleaseEnabled) {
    return t('in-plg:licenseBanner.titleDetail.sandboxTrial');
  }

  if (
    firstLicenseUsageMsg?.activeLicense == 'selfService' ||
    firstLicenseUsageMsg?.activeLicense == 'quota' ||
    firstLicenseUsageMsg?.activeLicense == 'free_not_for_resale'
  ) {
    return t('in-plg:licenseBanner.titleDetail.trial');
  }
  return '';
}
