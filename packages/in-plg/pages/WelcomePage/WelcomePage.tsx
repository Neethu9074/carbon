/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, ThemeProvider } from '@instana/components';

import { ampCompanyInfoEnabled, playwithEnabled } from 'in-services/featureFlags';
import WelcomeHeader from 'in-plg/components/WelcomeHeader/WelcomeHeader';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { productAreas } from 'in-services/tracking/productAreas';
import UserGoalSelection from 'in-plg/pages/UserGoalSelection';
import PageContent from 'in-plg/pages/WelcomePage/PageContent';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';

import locals from 'in-plg/pages/WelcomePage/WelcomePage.mless';

export default function WelcomePage() {
  const { location } = useNavigation();

  return (
    <div className={locals.container}>
      <ThemeProvider theme="g10">
        <UserGoalSelection />
        <WelcomeHeader onboardingHeaderEnabled={ampCompanyInfoEnabled && !playwithEnabled} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.home,
            pageRootName: pageNames.home,
            pagePath: location?.pathname
          }}
        />
        <Stack direction="vertical">
          <PageContent enableQuickLinkForAgentAndUser={!playwithEnabled} />
        </Stack>
      </ThemeProvider>
    </div>
  );
}
