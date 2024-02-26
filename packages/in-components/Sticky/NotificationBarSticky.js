/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { isCarbonShellEnabled } from 'in-components/MainNavigation/components/isCarbonShellEnabled';
import { playWithReleaseEnabled, playwithEnabled } from 'in-services/featureFlags';
import { OpenTrialExpiryDialog } from 'in-plg/components/Dialog/TrialExpiryDialog';
import { StickyBanner } from 'in-plg/components/LicenseBanner/StickyBanner';
import { UsageBanner } from 'in-plg/components/UsageBanner/UsageBanner';
import { messages$ } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { days } from 'in-services/time';

export default function NotificationBarSticky() {
  const [expiredDialogShown, setExpiredDialogShown] = useState(false);

  const messages = useObservable(messages$, []) ?? [];
  const firstLicenseUsageMsg = messages.find(message => message.isLicenseUsageMsg);

  const sevenDaysInMilliseconds = days.toMillis(7);
  const isSevenDaysOver = Date.now() - firstLicenseUsageMsg?.expiryDate > sevenDaysInMilliseconds;

  const isExpired = firstLicenseUsageMsg && Date.now() - firstLicenseUsageMsg?.expiryDate > 0;

  useEffect(() => {
    if (isExpired) {
      if (!expiredDialogShown) {
        // avoid showing the message again. Will show again on a page refresh.
        setExpiredDialogShown(true);
        addActiveDialog(<OpenTrialExpiryDialog message={firstLicenseUsageMsg} isSevenDaysOver={isSevenDaysOver} />);
      }
    }
    // ignoring firstLicenseUsageMsg and isSevenDaysOver
    // eslint-disable-next-line
  }, [isExpired]);

  if (firstLicenseUsageMsg) {
    if (!playwithEnabled && !playWithReleaseEnabled) {
      if (isCarbonShellEnabled()) {
        return <UsageBanner key={firstLicenseUsageMsg.id} message={firstLicenseUsageMsg} />;
      }
      return <StickyBanner key={firstLicenseUsageMsg.id} message={firstLicenseUsageMsg} />;
    }
  }
  return null;
}
