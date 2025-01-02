/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import OnboardingCarousel from 'in-plg/components/WelcomeHeader/OnboardingCarousel/OnboardingCarousel';
import { AccountActivationProp } from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import WelcomeToolbar from 'in-plg/components/WelcomeHeader/toolbar/WelcomeToolbar';
import DatePicker from 'in-plg/components/DatePicker/DatePicker';
import { playwithEnabled } from 'in-services/featureFlags';
import { user } from 'in-stores/user';

import locals from 'in-plg/components/WelcomeHeader/WelcomeHeader.mless';

interface WelcomeHeaderProps {
  onboardingHeaderEnabled: boolean;
  accountActivationData: AccountActivationProp;
}

export default function WelcomeHeader({ onboardingHeaderEnabled, accountActivationData }: WelcomeHeaderProps) {
  const username = onboardingHeaderEnabled
    ? `, ${user?.fullName ?? ''}!`
    : !playwithEnabled
    ? `, ${user?.fullName ?? ''}!`
    : '';
  const headerTitle = `${t('in-plg:welcomepage.heading')}${username}`;
  return (
    <div
      className={locals.stickyHeader}
      data-search-context={t('in-plg:assistme.dataSearchContext.gettingStarted')}
      data-testid="header"
    >
      <WelcomeToolbar title={headerTitle} />
      {onboardingHeaderEnabled && <OnboardingCarousel accountActivationData={accountActivationData} />}
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
