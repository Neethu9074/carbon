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
import { playwithEnabled, newOnboardingPageEnabled } from 'in-services/featureFlags';
import WelcomeToolbar from 'in-plg/components/WelcomeHeader/toolbar/WelcomeToolbar';
import { welcomePage, gettingStartedPath } from 'in-plg/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
import config from 'in-services/config';
import { user } from 'in-stores/user';

import locals from 'in-plg/components/WelcomeHeader/WelcomeHeader.mless';

interface WelcomeHeaderProps {
  onboardingHeaderEnabled: boolean;
  accountActivationData: AccountActivationProp;
}

export default function WelcomeHeader({ onboardingHeaderEnabled, accountActivationData }: WelcomeHeaderProps) {
  const username = getUsername();
  const { createHrefToPath } = useNavigation();
  const location = useLocation();
  const headerTitle = `${t('in-plg:welcomepage.heading')}${username}`;
  const { activeLicenseType } = config;
  const isTrial = activeLicenseType === 'selfService';
  return (
    <div
      className={locals.stickyHeader}
      data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}
      data-testid="header"
    >
      <WelcomeToolbar title={headerTitle} />
      {newOnboardingPageEnabled && isTrial ? (
        <LeftRightPadding>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href={createHrefToPath(welcomePage)}
              label={t('in-plg:onboarding.yourDashboard')}
              isActive={location.pathname === welcomePage}
              className={locals.tabItemOverride}
            />
            <SecondLevelNavigationItem
              href={createHrefToPath(gettingStartedPath)}
              label={t('in-plg:onboarding.gettingStarted')}
              isActive={location.pathname === gettingStartedPath}
              className={locals.tabItemOverride}
            />
          </SecondLevelNavigation>
        </LeftRightPadding>
      ) : (
        onboardingHeaderEnabled && <OnboardingCarousel accountActivationData={accountActivationData} />
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
