/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Stack, ThemeProvider } from '@instana/components';

import useGetAccountActivation, {
  AccountActivationProp
} from 'in-plg/pages/WelcomePage/widgets/hooks/useGetAccountActivation';
import { Activation } from 'in-plg/pages/WelcomePage/widgets/types/AccountInfoTypeDefinition';
import { solisEnabled, whatsNewBannerEnabled } from 'in-services/featureFlags';
import WelcomeHeader from 'in-plg/components/WelcomeHeader/WelcomeHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { productAreas } from 'in-services/tracking/productAreas';
import PageContent from 'in-plg/pages/WelcomePage/PageContent';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import config from 'in-services/config';

import locals from 'in-plg/pages/WelcomePage/WelcomePage.mless';

export default function WelcomePage() {
  const { location } = useNavigation();
  const activation = useGetAccountActivation();
  const currentTenantUnit = `${config.tenant}#${config.tenantUnit}`;
  const { activeLicenseType } = config;
  const [randomNumber, setRandomNumber] = useState(0);

  // Temporary. In the future, which teaser is loaded depends on which products are already integrated with Instana.
  useEffect(() => {
    setRandomNumber(Math.random());
  }, []);

  return (
    <div className={locals.container}>
      <ThemeProvider theme="g10">
        <WelcomeHeader
          onboardingHeaderEnabled={showCarousal(activation, currentTenantUnit, activeLicenseType)}
          accountActivationData={activation}
        />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.home,
            pageRootName: pageNames.home,
            pagePath: location?.pathname
          }}
        />
        <Stack direction="vertical">
          <PageContent />
        </Stack>
      </ThemeProvider>
      {solisEnabled &&
        (randomNumber < 0.5 ? (
          // @ts-expect-error TS2304: Cannot find name solis
          // component is loaded from a script in ui-client/packages/in-client/index.html
          <solis-teaser product="turbonomic" type="pop-up" variation="optimizations" />
        ) : (
          // @ts-expect-error TS2304: Cannot find name solis
          // component is loaded from a script in ui-client/packages/in-client/index.html
          <solis-teaser product="concert" type="pop-up" variation="vulnerabilities" />
        ))}
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
const showCarousal = (
  activation: AccountActivationProp,
  currentTenantUnit: string,
  activeLicenseType: string
): boolean => {
  if (activeLicenseType !== 'selfService' && whatsNewBannerEnabled) return true;
  // If it is selfService or if featureflag is off show the banner based on the below checklist
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
