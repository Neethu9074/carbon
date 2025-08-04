/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';
import { ArrowRight, Launch } from '@carbon/icons-react';

import { ExpressiveCard } from '@instana/ibm-products';
import { Typography } from '@instana/components';
import { Button, Stack } from '@instana/carbon';
import { t } from '@instana/i18n-react';

import { OnboardingTileData } from 'in-plg/pages/WelcomePage/GettingStarted/OnboardingTileData';
import { CommunityBlogsData } from 'in-plg/pages/WelcomePage/GettingStarted/CommunityBlogsData';
import { ContentSection } from 'in-plg/pages/WelcomePage/GettingStarted/ContentSection';
import { Container, MainBody, SidePanel } from 'in-plg/pages/onboarding/Layout/Layout';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

import locals from './GettingStartedContent.mless';

export default function GettingStartedContent() {
  const { trackCta } = useSegmentTracking();
  const onboardingItems = OnboardingTileData();
  const communityBlogsData = CommunityBlogsData();

  return (
    <Container>
      <MainBody>
        <ContentSection title={t('in-plg:onboarding.title')} description={t('in-plg:onboarding.description')}>
          <div className={locals.tileGrid}>
            {onboardingItems.map(item => (
              <ExpressiveCard
                key={item.key}
                label={<Typography variant="label-01">{t('in-plg:onboarding.taskLabel')}</Typography>}
                title={<Typography variant="heading-03"> {item.title}</Typography>}
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
        <ContentSection
          title={t('in-plg:onboarding.communityblogs.title')}
          description={t('in-plg:onboarding.communityblogs.description')}
        >
          <Stack gap="1rem">
            <div className={locals.tileGrid}>
              {communityBlogsData.map(item => (
                <ExpressiveCard
                  key={item.key}
                  label={<Typography variant="label-01">{t('in-plg:onboarding.communityblogs.blogLabel')}</Typography>}
                  title={<Typography variant="heading-03"> {item.title}</Typography>}
                  description={<Typography variant="body-02">{item.description}</Typography>}
                  onClick={() => {
                    window.open(item.href, '_blank');
                  }}
                  actionIcons={[
                    {
                      id: item.key,
                      icon: () => <Launch />,
                      iconDescription: item.title,
                      onClick: () => {
                        window.open(item.href, '_blank');
                      }
                    }
                  ]}
                />
              ))}
            </div>
            <Button
              kind="ghost"
              icon="lib_arrow_right"
              onClick={() => {
                window.open(
                  'https://community.ibm.com/community/user/groups/community-home?CommunityKey=8d661410-d1fb-4067-ab9a-019475fc541e',
                  '_blank',
                  'noreferrer'
                );
              }}
            >
              {t('in-plg:onboarding.joinCommunityLink')}
            </Button>
          </Stack>
        </ContentSection>
      </MainBody>
      <SidePanel>
        <></>
      </SidePanel>
    </Container>
  );
}
