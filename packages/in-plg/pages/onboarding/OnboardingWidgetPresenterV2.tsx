/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

//@ts-expect-error it is not yet migrated to typescript
import ProgressSection from 'in-waiting-for-deployment/components/OnboardingWidget/ProgressSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import Portal from 'in-plg/pages/onboarding/Portal';
import { t } from 'in-i18n';

import locals from 'in-plg/pages/onboarding/OnboardingWidgetPresenter.mless';

const WelcomeToInstanaBanner = () => {
  return (
    <LeftRightPadding>
      <div className={locals.verticalPadding}>
        <Stack gap="disabled">
          <Typography variant="heading-600">{t('in-plg:welcomeToInstana')}</Typography>
          <Typography variant="body-large">{t('in-plg:getStartedAndInstallYourFirstAgent')}</Typography>
        </Stack>
      </div>
    </LeftRightPadding>
  );
};

export default function OnboardingWidgetPresenterV2(props: any) {
  return (
    <div className={locals.wrapper}>
      <WelcomeToInstanaBanner />
      <ProgressSection {...props} />
      <Portal {...props} />
    </div>
  );
}
