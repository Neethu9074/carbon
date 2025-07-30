/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';
import { ArrowRight } from '@carbon/icons-react';

import { ExpressiveCard } from '@instana/ibm-products';
import { t } from '@instana/i18n-react';

import { OnboardingTileData } from 'in-plg/pages/WelcomePage/GettingStarted/OnboardingTileData';
import { ContentSection } from 'in-plg/pages/WelcomePage/GettingStarted/ContentSection';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

import locals from './GettingStartedContent.mless';

export default function GettingStartedContent() {
  const { trackCta } = useSegmentTracking();
  const onboardingItems = OnboardingTileData();

  return (
    <Container>
      <MainBody>
        <ContentSection title={t('in-plg:onboarding.title')} description={t('in-plg:onboarding.description')}>
          <div className={locals.tileGrid}>
            {onboardingItems.map(item => (
              <ExpressiveCard
                key={item.key}
                label={t('in-plg:onboarding.taskLabel')}
                title={item.title}
                pictogram={item.pictogram}
                onClick={() => {
                  trackCta(item.trackingEvent);
                  if (item.target === '_blank') {
                    window.open(item.href, '_blank');
                  } else {
                    window.location.href = item.href;
                  }
                }}
                actionIcons={[
                  {
                    id: item.key,
                    icon: () => <ArrowRight />,
                    iconDescription: item.title,
                    onClick: () => {
                      trackCta(item.trackingEvent);
                      if (item.target === '_blank') {
                        window.open(item.href, '_blank');
                      } else {
                        window.location.href = item.href;
                      }
                    }
                  }
                ]}
              />
            ))}
          </div>
        </ContentSection>
      </MainBody>

      <SidePanel>
        <></>
      </SidePanel>
    </Container>
  );
}
