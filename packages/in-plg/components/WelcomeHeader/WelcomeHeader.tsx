/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import OnboardingCarousel from 'in-plg/components/WelcomeHeader/OnboardingCarousel/OnboardingCarousel';
import { AccountActivationProp } from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import { YOUR_DASHBOARD_CLICKED, GETTINGSTARTED_CLICKED } from 'in-services/tracking/eventNames';
import { playwithEnabled, newOnboardingPageEnabled } from 'in-services/featureFlags';
import WelcomeToolbar from 'in-plg/components/WelcomeHeader/toolbar/WelcomeToolbar';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
import config from 'in-services/config';
import { user } from 'in-stores/user';

import locals from 'in-plg/components/WelcomeHeader/WelcomeHeader.mless';

interface WelcomeHeaderProps {
  onboardingHeaderEnabled: boolean;
  accountActivationData: AccountActivationProp;
  selectedWelcomePage: string;
  setSelectedWelcomePage: React.Dispatch<React.SetStateAction<string>>;
}

export default function WelcomeHeader({
  onboardingHeaderEnabled,
  accountActivationData,
  selectedWelcomePage,
  setSelectedWelcomePage
}: WelcomeHeaderProps) {
  const username = getUsername();
  const headerTitle = `${t('in-plg:welcomepage.heading')}${username}`;
  const { activeLicenseType } = config;
  const { trackCta } = useSegmentTracking();
  const isTrial = activeLicenseType === 'selfService';
  return (
    <div
      className={locals.stickyHeader}
      data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}
      data-testid="header"
    >
      <WelcomeToolbar title={headerTitle}>
        {newOnboardingPageEnabled && isTrial && (
          <LeftRightPadding>
            <SecondLevelNavigation>
              <SecondLevelNavigationItem
                label={t('in-plg:onboarding.yourDashboard')}
                isActive={selectedWelcomePage === 'yourDashboard'}
                onClick={() => {
                  trackCta(YOUR_DASHBOARD_CLICKED);
                  setSelectedWelcomePage('yourDashboard');
                }}
              />
              <SecondLevelNavigationItem
                label={t('in-plg:onboarding.gettingStarted')}
                isActive={selectedWelcomePage === 'gettingStarted'}
                onClick={() => {
                  trackCta(GETTINGSTARTED_CLICKED);
                  setSelectedWelcomePage('gettingStarted');
                }}
              />
            </SecondLevelNavigation>
          </LeftRightPadding>
        )}
      </WelcomeToolbar>
      {!(newOnboardingPageEnabled && isTrial) && onboardingHeaderEnabled && (
        <OnboardingCarousel accountActivationData={accountActivationData} />
      )}
    </div>
  );
}

export function DatePickerHeader() {
  return (
    <div className="header" data-testid="date-picker">
      <Stack direction="horizontal">
        <DatePicker darkTheme={false} />
      </Stack>
    </div>
  );
}

function getUsername() {
  if (playwithEnabled) return '';
  if (user?.fullName) return `, ${user.fullName}!`;
  return '';
}
