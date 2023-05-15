/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIconProps } from '@instana/components';

//@ts-expect-error needs migration
import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';

type Size = SvgIconProps['size'];
interface MobileAppScopePathProps {
  mobileAppId?: string;
  mobileAppName?: string;
  iconSize?: Size;
  showDashboardLinks?: boolean;
  noBottomMargin?: boolean;
}

export default function MobileAppScopePath({
  mobileAppId,
  mobileAppName,
  iconSize,
  showDashboardLinks,
  noBottomMargin
}: MobileAppScopePathProps) {
  const entries = [];
  if (mobileAppName) {
    const href$ = showDashboardLinks && mobileAppId ? getLinkToMobileApp(mobileAppId) : undefined;
    entries.push({
      iconType: 'lib_mobile_app',
      label: mobileAppName,
      href$
    } as ScopeEntryType);
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
