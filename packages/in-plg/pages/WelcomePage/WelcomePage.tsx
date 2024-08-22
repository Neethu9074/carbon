/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, ThemeProvider } from '@instana/components';

import useGetAccountActivation, {
  AccountActivationProp
} from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import { Activation } from 'in-plg/pages/WelcomePage/widgets/types/AccountInfoTypeDefinition';
import WelcomeHeader from 'in-plg/components/WelcomeHeader/WelcomeHeader';
import UserGoalSelection from 'in-plg/pages/UserGoalSelection';
import PageContent from 'in-plg/pages/WelcomePage/PageContent';
import { playwithEnabled } from 'in-services/featureFlags';
import config from 'in-services/config';

import locals from 'in-plg/pages/WelcomePage/WelcomePage.mless';

export default function WelcomePage() {
  const activation = useGetAccountActivation();
  const currentTenantUnit = `${config.tenant}#${config.tenantUnit}`;

  return (
    <div className={locals.container}>
      <ThemeProvider theme="g10">
        <UserGoalSelection />
        <WelcomeHeader
          onboardingHeaderEnabled={showCarousal(activation, currentTenantUnit)}
          accountActivationData={activation}
        />
        <Stack direction="vertical">
          <PageContent enableQuickLinkForAgentAndUser={!playwithEnabled} />
        </Stack>
      </ThemeProvider>
    </div>
  );
}

/**
 * The Instance onboarding section should not be available for
 * 1. Playwith
 * 2. If the TU has completed all the steps
 * 3. If portal data is not available (Air gapped environments)
 * @param {AccountActivationProp} activation API response from portal
 * @param {string} currentTenantUnit The key representing the tenant unit to check within the activation object.
 * @returns {boolean} Returns `true` if all specified activation statuses are `true`, otherwise `false`.
 */
const showCarousal = (activation: AccountActivationProp, currentTenantUnit: string): boolean => {
  if (playwithEnabled) return false;
  if (!activation || !activation[currentTenantUnit]) return false;
  const keysToCheck: Array<keyof Activation[typeof currentTenantUnit]> = [
    'fa',
    'tr',
    'au',
    'ai',
    'ap',
    'sas',
    'w',
    'u'
  ];
  return !keysToCheck.every(key => activation[currentTenantUnit]?.[key]?.status === true);
};
